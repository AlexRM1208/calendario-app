document.addEventListener("DOMContentLoaded", () => {
  setupMobileNavigation();
  setupCurrentDate();
  setupCalendar();
  setupQuotes();
  setupTypeFilters();
  setupQuiz();
  setupContactForm();
});

function setupMobileNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const sidebar = document.querySelector("#sidebar");

  if (!toggle || !sidebar) return;

  toggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupCurrentDate() {
  const todayText = document.querySelector("#todayText");
  const currentTime = document.querySelector("#currentTime");
  const dayOfYearElement = document.querySelector("#dayOfYear");
  const progressText = document.querySelector("#yearProgressText");
  const progressBar = document.querySelector("#yearProgressBar");

  const update = () => {
    const now = new Date();

    if (todayText) {
      todayText.textContent = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(now);
    }

    if (currentTime) {
      currentTime.textContent = new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }).format(now);
    }

    if (dayOfYearElement || progressText || progressBar) {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
      const dayOfYear = Math.floor((now - startOfYear) / 86400000) + 1;
      const totalDays = Math.floor((endOfYear - startOfYear) / 86400000);
      const progress = Math.round((dayOfYear / totalDays) * 100);

      if (dayOfYearElement) dayOfYearElement.textContent = `${dayOfYear}/${totalDays}`;
      if (progressText) progressText.textContent = `${progress}% do ano concluído`;
      if (progressBar) progressBar.style.width = `${progress}%`;
    }
  };

  update();
  setInterval(update, 1000);
}

function setupCalendar() {
  const title = document.querySelector("#calendarTitle");
  const grid = document.querySelector("#calendarGrid");
  const prevButton = document.querySelector("#prevMonth");
  const nextButton = document.querySelector("#nextMonth");

  if (!title || !grid || !prevButton || !nextButton) return;

  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  let visibleDate = new Date();

  function renderCalendar() {
    grid.innerHTML = "";

    const year = visibleDate.getFullYear();
    const month = visibleDate.getMonth();

    title.textContent = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric"
    }).format(visibleDate);

    weekdays.forEach((weekday) => {
      const cell = document.createElement("div");
      cell.className = "calendar-weekday";
      cell.textContent = weekday;
      grid.appendChild(cell);
    });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const previousMonthDays = new Date(year, month, 0).getDate();

    for (let i = firstDayIndex - 1; i >= 0; i -= 1) {
      const cell = document.createElement("div");
      cell.className = "calendar-day muted";
      cell.textContent = previousMonthDays - i;
      grid.appendChild(cell);
    }

    const today = new Date();

    for (let day = 1; day <= totalDays; day += 1) {
      const cell = document.createElement("div");
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      cell.className = isToday ? "calendar-day today" : "calendar-day";
      cell.textContent = day;
      grid.appendChild(cell);
    }

    const remainingCells = 42 - grid.children.length;

    for (let day = 1; day <= remainingCells; day += 1) {
      const cell = document.createElement("div");
      cell.className = "calendar-day muted";
      cell.textContent = day;
      grid.appendChild(cell);
    }
  }

  prevButton.addEventListener("click", () => {
    visibleDate = new Date(visibleDate.getFullYear(), visibleDate.getMonth() - 1, 1);
    renderCalendar();
  });

  nextButton.addEventListener("click", () => {
    visibleDate = new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 1);
    renderCalendar();
  });

  renderCalendar();
}

function setupQuotes() {
  const quoteBox = document.querySelector("#quoteBox");
  const newQuoteButton = document.querySelector("#newQuote");

  if (!quoteBox || !newQuoteButton) return;

  const quotes = [
    "Cada calendário é uma tentativa humana de transformar ciclos naturais em memória organizada.",
    "O tempo não cabe em caixas, mas o calendário nos ajuda a caminhar por ele.",
    "Marcar uma data é transformar um dia comum em referência.",
    "A história dos calendários mostra que ciência, cultura e poder sempre caminharam juntos.",
    "Sem calendários, seria muito mais difícil planejar colheitas, festas, viagens e compromissos."
  ];

  newQuoteButton.addEventListener("click", () => {
    const currentQuote = quoteBox.textContent.trim();
    const availableQuotes = quotes.filter((quote) => quote !== currentQuote);
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);

    quoteBox.textContent = availableQuotes[randomIndex];
  });
}

function setupTypeFilters() {
  const filterButtons = document.querySelectorAll(".filter-button");
  const cards = document.querySelectorAll(".type-card");

  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      cards.forEach((card) => {
        const categories = card.dataset.category.split(" ");
        const shouldShow =
          selectedFilter === "todos" || categories.includes(selectedFilter);

        card.hidden = !shouldShow;
      });
    });
  });
}

function setupQuiz() {
  const questionElement = document.querySelector("#quizQuestion");
  const optionsElement = document.querySelector("#quizOptions");
  const resultElement = document.querySelector("#quizResult");
  const nextButton = document.querySelector("#nextQuestion");

  if (!questionElement || !optionsElement || !resultElement || !nextButton) return;

  const questions = [
    {
      question: "Qual calendário é o mais usado civilmente no mundo atual?",
      options: ["Gregoriano", "Egípcio antigo", "Romano inicial", "Babilônico"],
      answer: "Gregoriano"
    },
    {
      question: "O ano bissexto serve principalmente para:",
      options: [
        "Ajustar o calendário ao ano solar",
        "Criar feriados extras",
        "Mudar o início da semana",
        "Reduzir a duração dos meses"
      ],
      answer: "Ajustar o calendário ao ano solar"
    },
    {
      question: "Qual astro é essencial para calendários lunares?",
      options: ["Lua", "Marte", "Saturno", "Vênus"],
      answer: "Lua"
    },
    {
      question: "Qual reforma deu origem ao calendário juliano?",
      options: [
        "Reforma de Júlio César",
        "Reforma de Gregório XIII",
        "Reforma de Copérnico",
        "Reforma de Galileu"
      ],
      answer: "Reforma de Júlio César"
    }
  ];

  let currentQuestionIndex = 0;
  let answered = false;

  function renderQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    answered = false;
    resultElement.textContent = "";
    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = "";

    currentQuestion.options.forEach((option) => {
      const button = document.createElement("button");
      button.className = "quiz-option";
      button.type = "button";
      button.textContent = option;

      button.addEventListener("click", () => {
        if (answered) return;

        answered = true;

        const isCorrect = option === currentQuestion.answer;

        button.classList.add(isCorrect ? "correct" : "wrong");

        optionsElement.querySelectorAll(".quiz-option").forEach((item) => {
          if (item.textContent === currentQuestion.answer) {
            item.classList.add("correct");
          }
        });

        resultElement.textContent = isCorrect
          ? "Resposta correta! ✔️"
          : `Quase! A resposta correta é: ${currentQuestion.answer}.`;
      });

      optionsElement.appendChild(button);
    });
  }

  nextButton.addEventListener("click", () => {
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    renderQuestion();
  });

  renderQuestion();
}

function setupContactForm() {
  const form = document.querySelector("#contactForm");

  if (!form) return;

  const fields = {
    nome: {
      input: form.querySelector("#nome"),
      error: form.querySelector("#nomeError"),
      validate(value) {
        if (value.trim().length < 3) return "Digite um nome com pelo menos 3 caracteres.";
        return "";
      }
    },
    email: {
      input: form.querySelector("#email"),
      error: form.querySelector("#emailError"),
      validate(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value.trim())) return "Digite um e-mail válido.";
        return "";
      }
    },
    tema: {
      input: form.querySelector("#tema"),
      error: form.querySelector("#temaError"),
      validate(value) {
        if (!value) return "Selecione um tema.";
        return "";
      }
    },
    mensagem: {
      input: form.querySelector("#mensagem"),
      error: form.querySelector("#mensagemError"),
      validate(value) {
        if (value.trim().length < 10) return "Digite uma mensagem com pelo menos 10 caracteres.";
        return "";
      }
    }
  };

  const status = form.querySelector("#formStatus");

  Object.values(fields).forEach(({ input, error, validate }) => {
    input.addEventListener("input", () => {
      const message = validate(input.value);
      error.textContent = message;
      input.setAttribute("aria-invalid", String(Boolean(message)));
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let hasError = false;

    Object.values(fields).forEach(({ input, error, validate }) => {
      const message = validate(input.value);

      error.textContent = message;
      input.setAttribute("aria-invalid", String(Boolean(message)));

      if (message) hasError = true;
    });

    if (hasError) {
      status.textContent = "Revise os campos antes de enviar.";
      return;
    }

    status.textContent = "Mensagem enviada com sucesso! Esta é uma simulação em JavaScript.";
    form.reset();

    Object.values(fields).forEach(({ input }) => {
      input.setAttribute("aria-invalid", "false");
    });
  });
}
