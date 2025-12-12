export const pt = {
  // Common
  common: {
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    create: 'Criar',
    search: 'Buscar',
    loading: 'Carregando...',
    noResults: 'Nenhum resultado encontrado',
    clear: 'Limpar',
    close: 'Fechar',
    confirm: 'Confirmar',
    back: 'Voltar',
    next: 'Próximo',
    yes: 'Sim',
    no: 'Não',
  },

  // Navbar
  navbar: {
    searchPlaceholder: 'Buscar recurso...',
    reports: 'Relatórios',
    charts: 'Gráficos',
    admin: 'Admin',
    profile: 'Perfil',
    settings: 'Configurações',
    signOut: 'Sair',
  },

  // Dashboard
  dashboard: {
    welcome: 'Olá',
    subtitle: 'Gerencie sua disponibilidade e veja quem está no escritório.',
    administrator: 'Administrador',
    resource: 'Recurso',
    weekly: 'Semanal',
    monthly: 'Mensal',
    officeToday: 'No Escritório Hoje',
    homeOffice: 'Home Office',
    corporateTravel: 'Viagem Corporativa',
    dayOff: 'Day Off',
    vacation: 'Férias',
    noOneInOffice: 'Ninguém no escritório hoje.',
    validated: 'Validado',
    pending: 'Pendente',
    noCheckin: 'Sem check-in',
  },

  // Status
  status: {
    office: 'Escritório',
    home_office: 'Home Office',
    corporate_travel: 'Viagem Corporativa',
    day_off: 'Day Off',
    vacation: 'Férias',
  },

  // Weekly View
  weekly: {
    title: 'Visão Semanal',
    previousWeek: 'Semana anterior',
    nextWeek: 'Próxima semana',
    currentWeek: 'Semana atual',
    resource: 'Recurso',
  },

  // Monthly View
  monthly: {
    title: 'Visão Mensal',
    previousMonth: 'Mês anterior',
    nextMonth: 'Próximo mês',
    currentMonth: 'Mês atual',
  },

  // Office Time Dialog
  officeTime: {
    title: 'Horário no Escritório',
    arrivalTime: 'Hora de Chegada',
    departureTime: 'Hora de Saída',
    save: 'Salvar',
  },

  // Check-in
  checkin: {
    checkIn: 'Fazer check-in',
    cancelCheckin: 'Cancelar check-in',
    validate: 'Validar presença',
    pendingValidation: 'Aguardando validação',
    validatedBy: 'Validado por',
  },

  // Auth
  auth: {
    signIn: 'Entrar',
    signUp: 'Cadastrar',
    email: 'Email',
    password: 'Senha',
    confirmPassword: 'Confirmar Senha',
    fullName: 'Nome Completo',
    forgotPassword: 'Esqueci minha senha',
    resetPassword: 'Redefinir Senha',
    sendResetLink: 'Enviar link de redefinição',
    backToLogin: 'Voltar ao login',
    noAccount: 'Não tem conta?',
    hasAccount: 'Já tem conta?',
    passwordRequirements: {
      title: 'Requisitos da senha',
      minLength: 'Mínimo de 8 caracteres',
      lowercase: 'Uma letra minúscula',
      uppercase: 'Uma letra maiúscula',
      number: 'Um número',
    },
    passwordStrength: {
      weak: 'Fraca',
      medium: 'Média',
      good: 'Boa',
      strong: 'Forte',
      secure: 'Senha segura! Todos os requisitos foram atendidos.',
    },
    errors: {
      invalidEmail: 'Email inválido',
      passwordMismatch: 'As senhas não coincidem',
      weakPassword: 'Senha não atende aos requisitos',
    },
  },

  // Profile
  profile: {
    title: 'Meu Perfil',
    fullName: 'Nome Completo',
    email: 'Email',
    jobFunction: 'Função',
    resourceGroup: 'Grupo',
    groupAdminOnly: 'O grupo só pode ser alterado por um administrador',
    updateSuccess: 'Perfil atualizado com sucesso',
    updateError: 'Erro ao atualizar perfil',
  },

  // Admin
  admin: {
    title: 'Administração',
    users: 'Usuários',
    createUser: 'Criar Usuário',
    editUser: 'Editar Usuário',
    deleteUser: 'Excluir Usuário',
    deleteConfirm: 'Tem certeza que deseja excluir este usuário?',
    role: 'Papel',
    active: 'Ativo',
    inactive: 'Inativo',
  },

  // Settings
  settings: {
    title: 'Configurações',
    userRoles: 'Papéis de Usuários',
    changeRole: 'Alterar papel',
  },

  // Reports
  reports: {
    title: 'Relatórios',
    selectMonth: 'Selecione o mês',
    export: 'Exportar',
    totalDays: 'Total de dias',
    officeDays: 'Dias no escritório',
    homeOfficeDays: 'Dias em home office',
    travelDays: 'Dias em viagem',
    dayOffDays: 'Dias de folga',
    vacationDays: 'Dias de férias',
  },

  // Charts
  charts: {
    title: 'Gráficos',
    selectMonth: 'Selecione o mês',
    statusDistribution: 'Distribuição por Status',
    weeklyTrend: 'Tendência Semanal',
  },

  // Resource Groups
  resourceGroup: {
    head: 'Head',
    lead: 'Lead',
    equipe: 'Equipe',
  },

  // Days of week
  days: {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo',
    mon: 'Seg',
    tue: 'Ter',
    wed: 'Qua',
    thu: 'Qui',
    fri: 'Sex',
    sat: 'Sáb',
    sun: 'Dom',
  },

  // Months
  months: {
    january: 'Janeiro',
    february: 'Fevereiro',
    march: 'Março',
    april: 'Abril',
    may: 'Maio',
    june: 'Junho',
    july: 'Julho',
    august: 'Agosto',
    september: 'Setembro',
    october: 'Outubro',
    november: 'Novembro',
    december: 'Dezembro',
  },
};

export type TranslationKeys = typeof pt;
