window.addEventListener("DOMContentLoaded", () => {
  renderChangeStorage();
  listenerChangeStorage();

  const loading = document.querySelector(
    "#formMain button[type='submit'] i.fa.fa-spinner"
  );
  const tblContent = document.querySelector("#tableMain tbody");
  const presentValueDom = document.querySelector("input[name='presentValue']");
  const rootPresentValue = parseFloat(presentValueDom.value || 0);

  const paymentValueDom = document.querySelector("input[name='paymentValue']");
  const paymentValueDateDom = document.querySelector(
    "select[name='paymentValueDate']"
  );
  const interestRateDom = document.querySelector("input[name='interestRate']");
  const interestRateDateDom = document.querySelector(
    "select[name='interestRateDate']"
  );
  const interestTimeDom = document.querySelector("input[name='interestTime']");
  const interestTimeDateDom = document.querySelector(
    "select[name='interestTimeDate']"
  );

  formMain.addEventListener("submit", async (e) => {
    e.preventDefault();
    loading.style.display = "inline-block";
    document.querySelector("#tableMain thead tr th:nth-child(1)").innerText =
      interestTimeDateDom.value;
    await delay(1000);

    const paymentValue = parseFloat(paymentValueDom.value || 0);
    const interestRate = parseFloat(interestRateDom.value || 0);
    const interestTime = parseFloat(interestTimeDom.value || 0);

    let renderResult = "";
    let presentValue = rootPresentValue;

    for (let index = 1; index <= interestTime; index += 1) {
      if (isPayment(index)) {
        presentValue += paymentValue;
      }

      presentValue += presentValue * getInterestRateByTime(interestRate);

      renderResult += ` <tr>
                            <td>${index}</td>
                            <td>${formatCurrency(presentValue)}</td>
                            <td>${formatCurrency(
                              presentValue - rootPresentValue
                            )}</td>
                        </tr>`;
    }

    tblContent.innerHTML = "";
    tblContent.innerHTML = renderResult;

    loading.style.display = "none";
  });

  const isPayment = (index) => {
    switch (paymentValueDateDom.value) {
      case "days":
        return index % 1 === 0;
      case "months":
        return index % 30 === 0;
      case "years":
        return index % 365 === 0;
      default:
        return false;
    }
  };

  const getInterestRateByTime = (interestRate) => {
    switch (interestTimeDateDom.value) {
      case "days":
        switch (interestRateDateDom.value) {
          case "days":
            return interestRate;
          case "months":
            return interestRate / 30;
          case "years":
            return interestRate / 365;
        }
      case "months":
        switch (interestRateDateDom.value) {
          case "days":
            return interestRate * 30;
          case "months":
            return interestRate;
          case "years":
            return interestRate / 12;
        }
      case "years":
        switch (interestRateDateDom.value) {
          case "days":
            return interestRate * 365;
          case "months":
            return interestRate * 12;
          case "years":
            return interestRate;
        }
      default:
        return 0;
    }
  };
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const formatCurrency = (value) => {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const renderChangeStorage = () => {
  const storage = JSON.parse(localStorage.getItem("inputStorage"));
  const allInput = document.querySelectorAll("input");
  const allSelect = document.querySelectorAll("select");

  allInput.forEach((input) => {
    if (storage[input.name]) {
      input.value = storage[input.name];
    }
  });

  allSelect.forEach((select) => {
    if (storage[select.name]) {
      select.value = storage[select.name];
    }
  });
};

const listenerChangeStorage = () => {
  const allInput = document.querySelectorAll("input");
  const allSelect = document.querySelectorAll("select");

  allInput.forEach((input) => {
    input.addEventListener("change", () => {
      const storage = JSON.parse(localStorage.getItem("inputStorage"));
      localStorage.setItem(
        "inputStorage",
        JSON.stringify({ ...storage, [input.name]: input.value })
      );
    });
  });

  allSelect.forEach((select) => {
    select.addEventListener("change", () => {
      const storage = JSON.parse(localStorage.getItem("inputStorage"));
      localStorage.setItem(
        "inputStorage",
        JSON.stringify({
          ...storage,
          [select.name]: select.value,
        })
      );
    });
  });
};
