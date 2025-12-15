import { TranslationKeys } from './pt';

export const es: TranslationKeys = {
  // Common
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    search: 'Buscar',
    loading: 'Cargando...',
    noResults: 'No se encontraron resultados',
    clear: 'Limpiar',
    close: 'Cerrar',
    confirm: 'Confirmar',
    back: 'Volver',
    next: 'Siguiente',
    yes: 'Sí',
    no: 'No',
  },

  // Navbar
  navbar: {
    searchPlaceholder: 'Buscar recurso...',
    reports: 'Informes',
    charts: 'Gráficos',
    admin: 'Admin',
    profile: 'Perfil',
    settings: 'Configuración',
    signOut: 'Salir',
  },

  // Dashboard
  dashboard: {
    welcome: 'Hola',
    subtitle: 'Gestiona tu disponibilidad y mira quién está en la oficina.',
    administrator: 'Administrador',
    resource: 'Recurso',
    weekly: 'Semanal',
    monthly: 'Mensual',
    officeToday: 'En la Oficina Hoy',
    homeOffice: 'Home Office',
    corporateTravel: 'Viaje Corporativo',
    dayOff: 'Día Libre',
    vacation: 'Vacaciones',
    noOneInOffice: 'Nadie en la oficina hoy.',
    validated: 'Validado',
    pending: 'Pendiente',
    noCheckin: 'Sin check-in',
  },

  // Status
  status: {
    office: 'Oficina',
    home_office: 'Home Office',
    corporate_travel: 'Viaje Corporativo',
    day_off: 'Día Libre',
    vacation: 'Vacaciones',
  },

  // Weekly View
  weekly: {
    title: 'Vista Semanal',
    previousWeek: 'Semana anterior',
    nextWeek: 'Próxima semana',
    currentWeek: 'Semana actual',
    resource: 'Recurso',
  },

  // Monthly View
  monthly: {
    title: 'Vista Mensual',
    previousMonth: 'Mes anterior',
    nextMonth: 'Próximo mes',
    currentMonth: 'Mes actual',
  },

  // Office Time Dialog
  officeTime: {
    title: 'Horario en la Oficina',
    arrivalTime: 'Hora de Llegada',
    departureTime: 'Hora de Salida',
    save: 'Guardar',
  },

  // Check-in
  checkin: {
    checkIn: 'Hacer check-in',
    cancelCheckin: 'Cancelar check-in',
    validate: 'Validar presencia',
    pendingValidation: 'Esperando validación',
    validatedBy: 'Validado por',
  },

  // Auth
  auth: {
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    fullName: 'Nombre Completo',
    country: 'País',
    selectCountry: 'Selecciona el país',
    forgotPassword: 'Olvidé mi contraseña',
    resetPassword: 'Restablecer Contraseña',
    sendResetLink: 'Enviar enlace de restablecimiento',
    backToLogin: 'Volver al inicio de sesión',
    noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',
    countries: {
      argentina: 'Argentina',
      brasil: 'Brasil',
      chile: 'Chile',
      colombia: 'Colombia',
      eua: 'EE.UU.',
    },
    passwordRequirements: {
      title: 'Requisitos de contraseña',
      minLength: 'Mínimo 8 caracteres',
      lowercase: 'Una letra minúscula',
      uppercase: 'Una letra mayúscula',
      number: 'Un número',
    },
    passwordStrength: {
      weak: 'Débil',
      medium: 'Media',
      good: 'Buena',
      strong: 'Fuerte',
      secure: '¡Contraseña segura! Todos los requisitos cumplidos.',
    },
    errors: {
      invalidEmail: 'Correo electrónico inválido',
      passwordMismatch: 'Las contraseñas no coinciden',
      weakPassword: 'La contraseña no cumple los requisitos',
    },
  },

  // Profile
  profile: {
    title: 'Mi Perfil',
    fullName: 'Nombre Completo',
    email: 'Correo electrónico',
    jobFunction: 'Función',
    resourceGroup: 'Grupo',
    groupAdminOnly: 'El grupo solo puede ser cambiado por un administrador',
    updateSuccess: 'Perfil actualizado con éxito',
    updateError: 'Error al actualizar el perfil',
  },

  // Admin
  admin: {
    title: 'Administración',
    users: 'Usuarios',
    createUser: 'Crear Usuario',
    editUser: 'Editar Usuario',
    deleteUser: 'Eliminar Usuario',
    deleteConfirm: '¿Estás seguro de que quieres eliminar este usuario?',
    role: 'Rol',
    active: 'Activo',
    inactive: 'Inactivo',
  },

  // Settings
  settings: {
    title: 'Configuración',
    userRoles: 'Roles de Usuario',
    changeRole: 'Cambiar rol',
  },

  // Reports
  reports: {
    title: 'Informes',
    selectMonth: 'Selecciona el mes',
    export: 'Exportar',
    totalDays: 'Total de días',
    officeDays: 'Días en oficina',
    homeOfficeDays: 'Días en home office',
    travelDays: 'Días de viaje',
    dayOffDays: 'Días libres',
    vacationDays: 'Días de vacaciones',
  },

  // Charts
  charts: {
    title: 'Gráficos',
    selectMonth: 'Selecciona el mes',
    statusDistribution: 'Distribución por Estado',
    weeklyTrend: 'Tendencia Semanal',
  },

  // Resource Groups
  resourceGroup: {
    head: 'Head',
    lead: 'Lead',
    equipe: 'Equipo',
  },

  // Days of week
  days: {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
    mon: 'Lun',
    tue: 'Mar',
    wed: 'Mié',
    thu: 'Jue',
    fri: 'Vie',
    sat: 'Sáb',
    sun: 'Dom',
  },

  // Months
  months: {
    january: 'Enero',
    february: 'Febrero',
    march: 'Marzo',
    april: 'Abril',
    may: 'Mayo',
    june: 'Junio',
    july: 'Julio',
    august: 'Agosto',
    september: 'Septiembre',
    october: 'Octubre',
    november: 'Noviembre',
    december: 'Diciembre',
  },
};
