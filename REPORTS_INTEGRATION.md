# Integración de Reportes - Frontend

## 📋 Resumen

Se ha integrado el módulo de reportes del backend en el frontend de la aplicación Dumpster App. Los reportes proporcionan métricas ejecutivas y análisis detallados del negocio.

## 🎯 Características Implementadas

### 1. **Dashboard Ejecutivo** (`/dashboard/reports`)
Muestra métricas clave del negocio en tiempo real:

#### Métricas Financieras
- Ingresos del mes actual
- Pagos pendientes
- Cargos adicionales
- Ingresos totales

#### Métricas Operacionales
- Contratos activos
- Dumpsters en uso vs disponibles
- Tasa de utilización
- Transferencias del día

#### Métricas de Clientes
- Clientes activos totales
- Nuevos clientes del mes
- Clientes con pagos vencidos

#### Métricas de Conductores
- Conductores activos
- Transferencias pendientes
- Pagos pendientes a conductores

#### Top 5 Clientes
- Lista de los mejores clientes por ingresos

## 📁 Estructura de Archivos

```
src/app/
├── types/
│   └── reports.ts                    # Tipos TypeScript para todos los reportes
├── lib/
│   └── reportsApi.ts                 # Servicio API para llamadas al backend
└── dashboard/
    └── reports/
        └── page.tsx                  # Componente principal del dashboard
```

## 🔧 Archivos Creados

### 1. `src/app/types/reports.ts`
Define todos los tipos TypeScript para los reportes:
- `DashboardReport`
- `RevenueReport`
- `ContractReport`
- `DumpsterUtilizationReport`
- Y todos sus sub-tipos

### 2. `src/app/lib/reportsApi.ts`
Servicio API con métodos para:
- `getDashboardReport()` - Dashboard ejecutivo
- `getRevenueReport(startDate?, endDate?)` - Reporte de ingresos
- `getContractReport(startDate?, endDate?, status?)` - Reporte de contratos
- `getDumpsterUtilizationReport()` - Reporte de utilización
- `healthCheck()` - Verificación de salud del API

### 3. `src/app/dashboard/reports/page.tsx`
Componente React que:
- Consume el API de reportes
- Muestra métricas en tarjetas visuales
- Maneja estados de carga y error
- Permite actualizar datos en tiempo real

## 🎨 Diseño

El dashboard utiliza:
- **Tailwind CSS** para estilos
- **Heroicons** para iconografía
- **Ant Design** para el layout general
- Diseño responsive (mobile-first)
- Tarjetas de métricas con colores distintivos

## 🔗 Navegación

Se agregó el item "Reportes" al menú lateral del dashboard:
- Icono: `BarChartOutlined` (Ant Design)
- Ruta: `/dashboard/reports`
- Posición: Segunda opción después de "Home"

## 🚀 Uso

### Acceder al Dashboard
1. Iniciar sesión en la aplicación
2. Click en "Reportes" en el menú lateral
3. El dashboard cargará automáticamente

### Actualizar Datos
- Click en el botón "Actualizar" en la esquina superior derecha
- Los datos se recargarán del backend

## 🔌 Integración con Backend

### Endpoint Base
```
https://backend-dumpster.onrender.com/api/reports
```

### Autenticación
- Usa JWT token almacenado en `localStorage`
- El interceptor de axios agrega automáticamente el header `Authorization`

### Endpoints Consumidos
- `GET /reports/dashboard` - Dashboard ejecutivo
- `GET /reports/revenue` - Reporte de ingresos
- `GET /reports/contracts` - Reporte de contratos
- `GET /reports/dumpster-utilization` - Utilización de dumpsters

## 📊 Próximos Pasos

### Reportes Adicionales a Implementar
1. **Reporte de Ingresos Detallado**
   - Gráficos de ingresos por mes
   - Desglose por cliente
   - Cargos adicionales

2. **Reporte de Contratos**
   - Distribución por estado
   - Contratos próximos a vencer
   - Análisis de duración

3. **Reporte de Utilización de Dumpsters**
   - Desglose por tamaño
   - Desglose por ubicación
   - Historial de uso

### Mejoras Sugeridas
- [ ] Agregar gráficos con Chart.js o Recharts
- [ ] Implementar filtros de fecha
- [ ] Exportar reportes a PDF/Excel
- [ ] Agregar comparativas mes a mes
- [ ] Implementar cache de datos
- [ ] Agregar notificaciones de métricas críticas

## 🐛 Manejo de Errores

El componente maneja:
- **Estado de carga**: Spinner mientras carga datos
- **Errores de red**: Mensaje de error con botón de reintento
- **Datos vacíos**: Muestra valores en 0

## 💡 Notas Técnicas

### Formato de Números
- Montos: `$X,XXX.XX` (con separador de miles)
- Porcentajes: `XX.X%` (un decimal)
- Enteros: Sin decimales

### Colores de Métricas
- Verde: Métricas positivas (ingresos, disponibilidad)
- Amarillo: Métricas de atención (pendientes)
- Rojo: Métricas críticas (vencidos, alertas)
- Azul/Púrpura: Métricas informativas

## 📝 Ejemplo de Uso del API

```typescript
import { reportsApi } from '@/app/lib/reportsApi';

// Obtener dashboard
const dashboard = await reportsApi.getDashboardReport();

// Obtener reporte de ingresos con fechas
const revenue = await reportsApi.getRevenueReport('2024-01-01', '2024-12-31');

// Obtener reporte de contratos filtrado
const contracts = await reportsApi.getContractReport(
  '2024-01-01', 
  '2024-12-31', 
  'ACTIVE'
);
```

## ✅ Testing

Para probar la integración:

1. **Backend debe estar corriendo** en:
   - Producción: `https://backend-dumpster.onrender.com`
   - Local: Actualizar `NEXT_PUBLIC_API_URL` en `.env.local`

2. **Credenciales de prueba**:
   - Usuario: `admin`
   - Password: `Admin123*-`

3. **Verificar**:
   - Login exitoso
   - Navegación a /dashboard/reports
   - Carga de métricas
   - Botón de actualizar funcional

## 🔐 Seguridad

- Todas las rutas requieren autenticación JWT
- Los tokens se almacenan en localStorage
- El interceptor maneja tokens expirados (redirect a login)
- Solo usuarios con rol ADMIN o MANAGER pueden acceder

## 📞 Soporte

Para problemas o dudas:
- Revisar logs del navegador (F12 > Console)
- Verificar que el backend esté activo
- Confirmar que el token JWT sea válido
- Revisar configuración de CORS en el backend
