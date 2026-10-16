# Guía de trabajo del proyecto

## Legibilidad del código

- Mantén JSX, HTML, CSS y TypeScript formateados en varias líneas cuando tengan más de un elemento o atributo.
- Prioriza una estructura visual clara para que otro desarrollador pueda leer y mantener el código sin tener que descomprimirlo mentalmente.
- Usa nombres descriptivos, componentes pequeños y una responsabilidad clara por archivo.
- Conserva las buenas prácticas de TypeScript, accesibilidad, tipado explícito y separación de responsabilidades.
- No comprimas componentes, objetos, arrays ni reglas CSS en una sola línea para ahorrar espacio.
- Respeta la organización existente de `app`: `components`, `contexts`, `hooks`, `layouts`, `routes`, `services`, `styles`, `types` y `utils`.

## Estilos

- Usa Tailwind CSS para los estilos de componentes y `tailwind-merge` para resolver clases condicionales o combinadas.
- Reserva el CSS global para tokens, estilos base y reglas que no sean prácticas como utilidades de Tailwind.
