# analizador-facturas-energia

Herramienta para analizar facturas eléctricas, comparar tarifas y generar propuestas comerciales automáticas.

## Instalación

```bash
npm install
```

## Uso

### Desarrollo

```bash
npm run dev
```

El servidor se inicia en `http://localhost:3000` con recarga automática.

### Producción

```bash
npm run build
npm start
```

## Interfaz web

1. Accede a `http://localhost:3000` en tu navegador.
2. Arrastra un PDF de Naturgy en la zona de carga o usa el botón para seleccionarlo.
3. Espera el procesamiento y revisa los resultados parseados en la pantalla.

Actualmente el parser reconoce facturas de Naturgy y devuelve CUPS, NIF/CIF, periodo de facturación,
consumos, potencias y términos de energía/potencia.
