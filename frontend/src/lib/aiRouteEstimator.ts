export interface RouteEstimate {
  distance_km: number;
  estimated_fuel_liters: number;
  estimated_fuel_cost: number;
  estimated_toll_cost: number;
  recommended_rate_per_ton: number;
  estimated_net_profit: number;
  profit_margin_percent: number;
}

export function estimateRouteProfitability(
  origin: string,
  destination: string,
  weight_tons: number,
  agreed_freight: number
): RouteEstimate {
  // Distance lookup matrix for key Indian logistics corridors
  const keyRoutes: Record<string, number> = {
    "mumbai-pune": 150,
    "bhiwandi-pune": 140,
    "mumbai-surat": 280,
    "taloja-pune": 130,
    "taloja-nashik": 170,
    "mumbai-ahmedabad": 530,
    "mumbai-delhi": 1420,
    "mumbai-bangalore": 980,
    "nagpur-mumbai": 820,
    "surat-nashik": 240,
  };

  const routeKey = `${origin.toLowerCase().split(",")[0].trim()}-${destination.toLowerCase().split(",")[0].trim()}`;
  const distance_km = keyRoutes[routeKey] || 350; // Default 350 KM fallback

  // Standard Indian 16-32 Ton Truck Fuel Mileage ~ 3.5 KM per Liter
  const fuel_price_per_liter = 92.5; // Diesel rate in INR
  const estimated_fuel_liters = Math.round(distance_km / 3.5);
  const estimated_fuel_cost = Math.round(estimated_fuel_liters * fuel_price_per_liter);

  // Toll rate approx ₹8 per KM for heavy commercial trucks
  const estimated_toll_cost = Math.round(distance_km * 7.5);

  // Operational buffer (Driver salary + loading + police)
  const operational_buffer = Math.round(distance_km * 4.0) + 2000;

  const total_estimated_cost = estimated_fuel_cost + estimated_toll_cost + operational_buffer;
  const estimated_net_profit = agreed_freight - total_estimated_cost;
  const profit_margin_percent = agreed_freight > 0 ? Math.round((estimated_net_profit / agreed_freight) * 100) : 0;
  const recommended_rate_per_ton = Math.round((total_estimated_cost * 1.3) / (weight_tons || 10));

  return {
    distance_km,
    estimated_fuel_liters,
    estimated_fuel_cost,
    estimated_toll_cost,
    recommended_rate_per_ton,
    estimated_net_profit,
    profit_margin_percent,
  };
}
