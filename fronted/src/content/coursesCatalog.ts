export type Course = {
  slug: string;
  title: string;
  summary: string;
  highlights: string[];
  audience: string;
  modality: string;
  level: string;
  topics?: string[];
};

export type CourseCategory = {
  id: string;
  label: string;
  description: string;
  courses: Course[];
};

export const coursesCatalog: CourseCategory[] = [
  {
    id: "iot",
    label: "IoT y Sistemas Embebidos",
    description:
      "Desde fundamentos hasta implementación práctica: sensores, redes, monitoreo y despliegue de soluciones IoT.",
    courses: [
      {
        slug: "fundamentos-iot",
        title: "Fundamentos de IoT (de cero a proyecto)",
        summary:
          "Aprende los conceptos clave de IoT y construye un proyecto funcional conectando sensores, enviando datos y visualizando métricas.",
        highlights: [
          "Arquitectura IoT: dispositivo–red–nube–dashboard",
          "Sensores y adquisición de datos",
          "Buenas prácticas de seguridad y despliegue",
        ],
        audience: "Estudiantes, docentes y profesionales que inician en IoT.",
        modality: "Presencial y online.",
        level: "Básico",
        topics: [
          "Conceptos base: IoT, telemetría y casos de uso",
          "Sensores, muestreo y calidad de datos",
          "Transporte de datos y visualización",
        ],
      },
      {
        slug: "esp32-sensores-telemetria",
        title: "ESP32 + Sensores: integración y telemetría",
        summary:
          "Integra sensores comunes con ESP32 y transmite lecturas de forma confiable para monitoreo en tiempo real.",
        highlights: [
          "Lectura de sensores y calibración básica",
          "Comunicación y envío de datos",
          "Manejo de fallos y reconexión",
        ],
        audience: "Personas con nociones de electrónica/programación.",
        modality: "Presencial y online.",
        level: "Intermedio",
        topics: [
          "GPIO, buses comunes y lectura estable",
          "Estrategias de reconexión y tolerancia a fallos",
          "Envío de datos hacia un backend/dashboard",
        ],
      },
    ],
  },
  {
    id: "automation",
    label: "Automatización y Control",
    description:
      "Control industrial y automatización aplicada con enfoque práctico: procesos, instrumentación y control.",
    courses: [
      {
        slug: "automatizacion-industrial",
        title: "Automatización industrial (introducción práctica)",
        summary:
          "Comprende el flujo completo de una automatización: sensores, actuadores, lógica de control y monitoreo.",
        highlights: [
          "Sensores/actuadores y señales básicas",
          "Lógica de control y seguridad operativa",
          "Monitoreo y diagnóstico de fallas",
        ],
        audience: "Estudiantes técnicos/universitarios y personal operativo.",
        modality: "Presencial y online.",
        level: "Básico–Intermedio",
        topics: [
          "Señales analógicas y digitales (visión general)",
          "Ciclo de control y protección básica",
          "Supervisión y mantenimiento preventivo",
        ],
      },
      {
        slug: "instrumentacion-calibracion",
        title: "Instrumentación: medición, calibración y lectura",
        summary:
          "Domina fundamentos de instrumentación: medición, lectura de variables y criterios básicos de confiabilidad.",
        highlights: [
          "Variables industriales y principios de medición",
          "Calibración y verificación básica",
          "Interpretación de lecturas y tolerancias",
        ],
        audience: "Técnicos, estudiantes y profesionales.",
        modality: "Presencial y online.",
        level: "Básico",
        topics: [
          "Principios de medición y error",
          "Rutinas de verificación y calibración (básico)",
          "Criterios de lectura e interpretación",
        ],
      },
    ],
  },
  {
    id: "software",
    label: "Software y Datos",
    description:
      "Construye la capa web del sistema: APIs, dashboards y visualización con buenas prácticas de desarrollo.",
    courses: [
      {
        slug: "dashboards-react-ux",
        title: "Dashboards con React: visualización y UX",
        summary:
          "Diseña dashboards claros y responsivos: métricas, estados, alertas y gráficas con enfoque en experiencia de usuario.",
        highlights: [
          "Componentes, estados y consumo de APIs",
          "Diseño responsive y accesibilidad básica",
          "Gráficos y lectura de métricas",
        ],
        audience: "Estudiantes y profesionales de desarrollo.",
        modality: "Presencial y online.",
        level: "Intermedio",
        topics: [
          "Arquitectura de UI y manejo de estado",
          "Tablas, gráficas y patrones de dashboard",
          "Responsive y buenas prácticas de UX",
        ],
      },
      {
        slug: "apis-iot-rest-tiempo-real",
        title: "APIs para proyectos IoT (REST + tiempo real)",
        summary:
          "Construye una API sólida para dispositivos y dashboards, incluyendo flujos en tiempo real para telemetría.",
        highlights: [
          "Diseño de endpoints y validación",
          "Autenticación y control de acceso",
          "Integración con tiempo real (conceptos)",
        ],
        audience: "Desarrolladores y perfiles técnicos.",
        modality: "Presencial y online.",
        level: "Intermedio",
        topics: [
          "Diseño de API y validación de datos",
          "Autenticación (JWT/sesiones) y permisos",
          "Telemetría en tiempo real: conceptos y trade-offs",
        ],
      },
    ],
  },
];
