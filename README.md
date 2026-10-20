# Finanzas claras

Aplicación web para planificar y visualizar la evolución estimada del patrimonio mediante planes de ahorro e inversión. Permite combinar varios planes, definir cambios de aportaciones y rentabilidad por etapas y consultar una proyección conjunta.

La aplicación está disponible en español e inglés e incluye temas claro, oscuro y del sistema. Los planes y la fecha final de simulación se guardan en el almacenamiento local del navegador.

## Funciones

- Crear, editar, duplicar y eliminar planes.
- Clasificar cada plan como liquidez, renta fija, renta variable o mixto.
- Definir una aportación inicial y etapas con fechas, aportación periódica, frecuencia (mensual, trimestral o anual) y rentabilidad anual esperada.
- Consultar el capital final estimado, las aportaciones iniciales y periódicas, los rendimientos y el desglose por tipo de plan.
- Explorar la evolución mensual en un gráfico, ajustar su intervalo y cambiar la fecha final de la proyección.
- Usar la interfaz en español o inglés y elegir el tema visual.

> Las cifras son proyecciones orientativas basadas en las aportaciones y rentabilidades que se introducen. No representan una garantía de resultados. Los retiros puntuales todavía no se aplican al cálculo.

## Requisitos

- Node.js 24 o posterior
- npm

## Desarrollo local

Instala las dependencias e inicia el servidor de desarrollo:

```bash
npm install
npm run dev
```

Vite mostrará la dirección local disponible (normalmente `http://localhost:5173`).

## Compilación y ejecución

```bash
npm run build
npm run start
```

El servidor de producción escucha en el puerto `3042` por defecto. Puedes cambiarlo con las variables `HOST` y `PORT`.

Para comprobar los tipos de TypeScript:

```bash
npm run typecheck
```

## Docker Compose

El proyecto incluye `compose.yaml`, que construye y ejecuta la aplicación en el puerto local `3042`:

```bash
docker compose up --build -d
```

Abre `http://localhost:3042`. Para detenerla:

```bash
docker compose down
```

También puedes construir y ejecutar la imagen directamente:

```bash
docker build -t finance-tools .
docker run --rm -p 3042:3042 finance-tools
```

## Tecnologías

- React 19 y TypeScript
- React Router con renderizado en servidor
- Vite y Tailwind CSS
- i18next para traducciones

## Estructura principal

```text
app/
├── components/financial/  # Editor de planes, tarjetas y gráficos
├── routes/                # Inicio y calculadora de patrimonio
├── types/                 # Tipos de los planes y etapas
└── utils/                 # Cálculos financieros y utilidades
```
