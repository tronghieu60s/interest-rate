window.addEventListener("DOMContentLoaded", () => {
  renderChangeStorage();
  listenerChangeStorage();

  const loading = document.querySelector(
    "#formMain button[type='submit'] i.fa.fa-spinner"
  );
  const tblContent = document.querySelector("#tableMain tbody");
  const presentValueDom = document.querySelector("input[name='presentValue']");

  const paymentValueDom = document.querySelector("input[name='paymentValue']");
  const paymentValueDateDom = document.querySelector(
    "select[name='paymentValueDate']"
  );
  const interestRateDom = document.querySelector("input[name='interestRate']");
  const interestRateDateDom = document.querySelector(
    "select[name='interestRateDate']"
  );
  const interestRateTermDom = document.querySelector(
    "input[name='interestRateTerm']"
  );
  const interestRateTermDateDom = document.querySelector(
    "select[name='interestRateTermDate']"
  );
  const interestTimeDateDom = document.querySelector(
    "select[name='interestTimeDate']"
  );

  formMain.addEventListener("submit", async (e) => {
    e.preventDefault();
    loading.style.display = "inline-block";
    tblContent.innerHTML = "";
    await delay(1000);
    document.querySelector("#tableMain thead tr th:nth-child(1)").innerText =
      interestTimeDateDom.value;

    const rootPresentValue = parseFloat(presentValueDom.value || 0);

    let renderResult = "";
    let presentValue = rootPresentValue;
    let paymentTotalValue = 0;
    let paymentPresentValue = rootPresentValue;
    let previousPresentValue = rootPresentValue;

    for (let index = 1; index <= getInterestDate(); index += 1) {
      previousPresentValue = presentValue;

      const paymentValue = getPaymentValue();
      if (isPayment(index)) {
        presentValue += paymentValue;
        paymentTotalValue += paymentValue;
        paymentPresentValue += paymentValue;
      }

      if (isCalculateInterest(index)) {
        presentValue += (presentValue * getInterestRate()) / 100;
      }

      renderResult += ` <tr>
                            <td>${index}</td>
                            <td>${formatCurrency(paymentPresentValue)}</td>
                            <td>${
                              formatCurrency(isPayment(index) ? paymentValue : 0)
                            }</td>
                            <td>${formatCurrency(
                              presentValue - previousPresentValue
                            )}</td>
                            <td>${formatCurrency(
                              presentValue -
                                rootPresentValue -
                                paymentTotalValue
                            )}</td>
                            <td>${formatCurrency(presentValue)}</td>
                        </tr>`;
    }

    tblContent.innerHTML = "";
    tblContent.innerHTML = renderResult;

    loading.style.display = "none";
  });

  const isPayment = (index) => {
    switch (interestTimeDateDom.value) {
      case "days":
        switch (paymentValueDateDom.value) {
          case "days":
            return index % 1 === 0;
          case "months":
            return index % 30 === 0;
          case "years":
            return index % 365 === 0;
        }
      case "months":
        switch (paymentValueDateDom.value) {
          case "days":
            return true;
          case "months":
            return index % 1 === 0;
          case "years":
            return index % 12 === 0;
        }
      case "years":
        switch (paymentValueDateDom.value) {
          case "days":
          case "months":
          case "years":
            return true;
        }
      default:
        return false;
    }
  };

  const getPaymentValue = (index) => {
    const paymentValue = parseFloat(paymentValueDom.value || 0);
    switch (interestTimeDateDom.value) {
      case "days":
        switch (paymentValueDateDom.value) {
          case "days":
          case "months":
          case "years":
            return paymentValue;
        }
      case "months":
        switch (paymentValueDateDom.value) {
          case "days":
            return paymentValue * 30;
          case "months":
          case "years":
            return paymentValue;
        }
      case "years":
        switch (paymentValueDateDom.value) {
          case "days":
            return paymentValue * 365;
          case "months":
            return paymentValue * 12;
          case "years":
            return paymentValue;
        }
      default:
        return 0;
    }
  };

  const getInterestDate = () => {
    const interestRateTerm = parseFloat(interestRateTermDom.value || 0);
    switch (interestTimeDateDom.value) {
      case "days":
        switch (interestRateTermDateDom.value) {
          case "days":
            return interestRateTerm;
          case "months":
            return interestRateTerm * 30;
          case "years":
            return interestRateTerm * 365;
        }
      case "months":
        switch (interestRateTermDateDom.value) {
          case "days":
            return interestRateTerm / 30;
          case "months":
            return interestRateTerm;
          case "years":
            return interestRateTerm * 12;
        }
      case "years":
        switch (interestRateTermDateDom.value) {
          case "days":
            return interestRateTerm / 365;
          case "months":
            return interestRateTerm / 12;
          case "years":
            return interestRateTerm;
        }
      default:
        return 0;
    }
  };

  const getInterestRate = () => {
    const interestRate = parseFloat(interestRateDom.value || 0);
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

  const isCalculateInterest = (index) => {
    switch (interestTimeDateDom.value) {
      case "days":
        switch (interestTimeDateDom.value) {
          case "days":
            return index % 1 === 0;
          case "months":
            return index % 30 === 0;
          case "years":
            return index % 365 === 0;
        }
      case "months":
        switch (interestTimeDateDom.value) {
          case "days":
            return true;
          case "months":
            return index % 1 === 0;
          case "years":
            return index % 12 === 0;
        }
      case "years":
        switch (interestTimeDateDom.value) {
          case "days":
          case "months":
          case "years":
            return true;
        }
      default:
        return false;
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
