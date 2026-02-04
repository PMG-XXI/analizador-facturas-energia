# Analizador de facturas de energía

Proyecto Node.js + TypeScript para analizar facturas eléctricas en PDF y comparar tarifas energéticas en España (Naturgy, Endesa, Iberdrola, ADX). Está pensado para consultores energéticos que necesitan automatizar la extracción de datos clave y generar propuestas comerciales.

## Características

- API Express lista para extender con endpoints de carga de PDFs.
- Parser base con `pdf-parse` para extraer texto y metadatos de factura.
- Comparador de tarifas configurable para estimar ahorro potencial.
- Tipado TypeScript para modelos de factura y tarifas.
- CI básico con GitHub Actions.

## Requisitos

- Node.js >= 18
- npm >= 9

## Instalación

```bash
npm install
```

## Configuración

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

2. Ajusta las variables según tu entorno.

## Uso

### Desarrollo

```bash
npm run dev
```

### Compilar

```bash
npm run build
```

### Producción

```bash
npm start
```

### Ejemplo de endpoint

- `POST /api/parse` (pendiente de implementar): subir PDF para extraer datos.
- `POST /api/compare` (pendiente de implementar): comparar tarifa actual con alternativas.

## Estructura del proyecto

```
.
├── docs/                  # Documentación adicional
├── src/
│   ├── comparator/        # Lógica de comparación de tarifas
│   ├── parser/            # Parsers de facturas PDF
│   ├── types/             # Tipos y modelos TypeScript
│   └── index.ts           # Servidor Express
├── tests/                 # Tests unitarios
├── .env.example           # Variables de entorno de ejemplo
├── package.json
└── tsconfig.json
```

## Próximos pasos sugeridos

- Implementar endpoints de carga y comparación en `src/index.ts`.
- Crear parsers específicos por comercializadora (Naturgy, Endesa, Iberdrola, ADX).
- Añadir validaciones y normalización de datos.
- Conectar con una base de datos para almacenar facturas y resultados.

## Licencia

MIT
