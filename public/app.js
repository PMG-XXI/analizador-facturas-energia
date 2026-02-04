const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileButton = document.getElementById("fileButton");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const results = document.getElementById("results");

const fields = {
  provider: document.getElementById("provider"),
  cups: document.getElementById("cups"),
  holderId: document.getElementById("holderId"),
  tariff: document.getElementById("tariff"),
  invoiceDate: document.getElementById("invoiceDate"),
  billingPeriod: document.getElementById("billingPeriod"),
  consumptionP1: document.getElementById("consumptionP1"),
  consumptionP2: document.getElementById("consumptionP2"),
  consumptionP3: document.getElementById("consumptionP3"),
  consumptionTotal: document.getElementById("consumptionTotal"),
  powerP1: document.getElementById("powerP1"),
  powerP2: document.getElementById("powerP2"),
  powerP3: document.getElementById("powerP3"),
  energyP1: document.getElementById("energyP1"),
  energyP2: document.getElementById("energyP2"),
  energyP3: document.getElementById("energyP3"),
  powerTermP1: document.getElementById("powerTermP1"),
  powerTermP2: document.getElementById("powerTermP2"),
  powerTermP3: document.getElementById("powerTermP3"),
  totalAmount: document.getElementById("totalAmount"),
};

const consumptionChart = document.getElementById("consumptionChart");

const formatNumber = (value, unit = "") => {
  if (value === null || value === undefined) {
    return "-";
  }
  const formatted = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
  return `${formatted}${unit}`;
};

const setLoading = (isLoading) => {
  loading.classList.toggle("hidden", !isLoading);
  dropzone.classList.toggle("disabled", isLoading);
};

const showError = (message) => {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
};

const clearError = () => {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
};

const setResults = (data) => {
  results.classList.remove("hidden");
  fields.provider.textContent = data.provider ?? "-";
  fields.cups.textContent = data.cups ?? "-";
  fields.holderId.textContent = data.holderId ?? "-";
  fields.tariff.textContent = data.tariffType ?? "-";
  fields.invoiceDate.textContent = data.invoiceDate ?? "-";
  fields.billingPeriod.textContent =
    data.billingPeriod?.start && data.billingPeriod?.end
      ? `${data.billingPeriod.start} → ${data.billingPeriod.end}`
      : "-";

  fields.consumptionP1.textContent = formatNumber(data.consumptionKwh?.P1, " kWh");
  fields.consumptionP2.textContent = formatNumber(data.consumptionKwh?.P2, " kWh");
  fields.consumptionP3.textContent = formatNumber(data.consumptionKwh?.P3, " kWh");
  fields.consumptionTotal.textContent = formatNumber(data.consumptionKwh?.total, " kWh");

  fields.powerP1.textContent = formatNumber(data.contractedPowerKw?.P1, " kW");
  fields.powerP2.textContent = formatNumber(data.contractedPowerKw?.P2, " kW");
  fields.powerP3.textContent = formatNumber(data.contractedPowerKw?.P3, " kW");

  fields.energyP1.textContent = formatNumber(data.energyTermEurPerKwh?.P1, " €/kWh");
  fields.energyP2.textContent = formatNumber(data.energyTermEurPerKwh?.P2, " €/kWh");
  fields.energyP3.textContent = formatNumber(data.energyTermEurPerKwh?.P3, " €/kWh");

  fields.powerTermP1.textContent = formatNumber(data.powerTermEurPerKwDay?.P1, " €/kW día");
  fields.powerTermP2.textContent = formatNumber(data.powerTermEurPerKwDay?.P2, " €/kW día");
  fields.powerTermP3.textContent = formatNumber(data.powerTermEurPerKwDay?.P3, " €/kW día");

  fields.totalAmount.textContent = formatNumber(data.totalAmountEur, " €");

  renderConsumptionChart(data.consumptionKwh);
};

const renderConsumptionChart = (consumption) => {
  const values = [
    { label: "P1", value: consumption?.P1 ?? 0 },
    { label: "P2", value: consumption?.P2 ?? 0 },
    { label: "P3", value: consumption?.P3 ?? 0 },
  ];
  const maxValue = Math.max(...values.map((item) => item.value), 1);

  consumptionChart.innerHTML = "";
  values.forEach((item) => {
    const bar = document.createElement("div");
    bar.className = "chart-bar";
    bar.style.height = `${Math.round((item.value / maxValue) * 100)}%`;

    const label = document.createElement("span");
    label.textContent = item.label;
    bar.appendChild(label);

    consumptionChart.appendChild(bar);
  });
};

const uploadFile = async (file) => {
  clearError();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/parse", {
      method: "POST",
      body: formData,
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error ?? "No se ha podido procesar el PDF.");
    }

    setResults(payload.parsed ?? {});
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
};

const handleFiles = (files) => {
  if (!files || files.length === 0) {
    return;
  }
  const file = files[0];
  if (file.type !== "application/pdf") {
    showError("El archivo debe ser un PDF.");
    return;
  }
  uploadFile(file);
};

fileButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (event) => handleFiles(event.target.files));

dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropzone.classList.remove("dragover");
  handleFiles(event.dataTransfer.files);
});

dropzone.addEventListener("click", () => fileInput.click());

