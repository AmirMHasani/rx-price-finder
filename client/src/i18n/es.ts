import type { TranslationKeys } from "./en";

export const es: TranslationKeys = {
  // Header
  appName: "RxPriceFinder",
  appTagline: "Compare precios de medicamentos con su seguro",
  
  // Homepage
  heroTitle: "Encuentre el Mejor Precio para su Receta",
  heroSubtitle: "Compare precios reales basados en seguros en farmacias locales. Ingrese su medicamento e información del seguro a continuación para ver qué farmacia ofrece el precio más bajo con su cobertura.",
  
  // Search Form
  searchTitle: "Busque su Medicamento",
  searchSubtitle: "Busque en la base de datos real de medicamentos e información de seguros para comparar precios",
  medicationInfo: "Información del Medicamento",
  medicationName: "Nombre del Medicamento",
  medicationPlaceholder: "Buscar medicamentos (ej., lipitor, metformina)...",
  dosage: "Dosis",
  dosagePlaceholder: "ej., 500mg, 10mg",
  form: "Forma",
  formPlaceholder: "ej., Tableta, Cápsula",
  frequency: "¿Con qué frecuencia lo toma?",
  quantity: "¿Cuántos días de suministro?",
  totalPills: "Total de píldoras:",
  zipCode: "Su Código Postal (Opcional)",
  
  // Insurance
  insuranceInfo: "Información del Seguro",
  insurancePlan: "Plan de Seguro",
  insurancePlaceholder: "Seleccione su plan de seguro",
  deductibleMet: "Ya cumplí con mi deducible este año",
  compareButton: "Comparar Precios",
  
  // Frequency options
  onceDaily: "Una vez al día",
  twiceDaily: "Dos veces al día",
  threeTimes: "Tres veces al día",
  fourTimes: "Cuatro veces al día",
  everyOtherDay: "Cada dos días",
  onceWeekly: "Una vez a la semana",
  asNeeded: "Según sea necesario",
  
  // Recent Searches
  recentSearches: "Búsquedas Recientes",
  clearHistory: "Borrar Historial",
  zip: "Código Postal:",
  timeAgo: {
    justNow: "justo ahora",
    minutesAgo: "hace {{count}}m",
    hoursAgo: "hace {{count}}h",
    daysAgo: "hace {{count}}d",
  },
  
  // Feature Cards
  realDataTitle: "Datos Reales de Medicamentos",
  realDataDesc: "Busque en las bases de datos oficiales de la FDA y RxNorm con nombres reales de medicamentos e información.",
  insurancePricingTitle: "Precios Basados en Seguros",
  insurancePricingDesc: "Vea precios reales basados en su plan de seguro específico, no solo precios en efectivo.",
  saveMoneyTitle: "Ahorre Dinero",
  saveMoneyDesc: "Encuentre el precio más bajo para su receta y ahorre cientos de dólares por año.",
  
  // Results Page
  newSearch: "Nueva Búsqueda",
  print: "Imprimir",
  share: "Compartir",
  
  // Medication Info
  onceDailyText: "Una vez al día",
  daysSupply: "Suministro de {{count}} días",
  pills: "{{count}} píldoras",
  
  // Alternatives
  alternativesTitle: "Considere Estas Alternativas",
  alternativesSubtitle: "Puede ahorrar dinero cambiando a una alternativa genérica o terapéutica",
  alternative: "Alternativa",
  generic: "Genérico",
  alternativeFor: "Alternativa para {{condition}}",
  savePercent: "Ahorre {{percent}}%",
  estimated: "estimado",
  
  // Price Summary
  priceSummaryTitle: "Resumen de Comparación de Precios",
  lowestPrice: "Precio Más Bajo",
  highestPrice: "Precio Más Alto",
  averagePrice: "Precio Promedio",
  potentialSavings: "Ahorros Potenciales",
  recommendedPharmacy: "💡 Farmacia Recomendada",
  milesAway: "{{distance}} millas de distancia",
  bestValue: "Mejor valor",
  
  // Filters
  distance: "Distancia",
  allDistances: "Todas las distancias",
  lessThan1Mile: "< 1 milla",
  lessThan5Miles: "< 5 millas",
  lessThan10Miles: "< 10 millas",
  features: "Características",
  feature24Hour: "24 Horas",
  featureDriveThru: "Servicio al Auto",
  featureDelivery: "Entrega a Domicilio",
  sortBy: "Ordenar por",
  sortPriceLowHigh: "Precio: Bajo a Alto",
  sortDistanceNearFar: "Distancia: Cerca a Lejos",
  sortSavingsHighLow: "Ahorros: Alto a Bajo",
  
  // Pharmacy Results
  foundPharmacies: "Se encontraron {{count}} farmacias",
  saveUpTo: "Ahorre hasta ${{amount}}",
  lowestPriceBadge: "Precio Más Bajo",
  getDirections: "Obtener Direcciones",
  cashPrice: "Precio en Efectivo",
  withInsurance: "Con {{insurance}}",
  save: "Ahorre ${{amount}}",
  withCoupon: "Con Cupón de {{provider}}",
  bestPrice: "¡Mejor Precio!",
  saveCoupon: "Ahorre ${{amount}} vs precio en efectivo",
  
  // Map
  pharmacyLocations: "Ubicaciones de Farmacias",
  clickMarkers: "Haga clic en los marcadores para ver detalles",
  
  // Days of week
  monday: "Lun",
  tuesday: "Mar",
  wednesday: "Mié",
  thursday: "Jue",
  friday: "Vie",
  saturday: "Sáb",
  sunday: "Dom",
  closed: "Cerrado",
  hours24: "24 Horas",
  
  // Common
  loading: "Cargando...",
  error: "Ocurrió un error",
  tryAgain: "Intentar de nuevo",
};
