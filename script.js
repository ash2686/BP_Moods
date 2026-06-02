const supabaseUrl = "https://nrlyvjvysrxbbwmygxqx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybHl2anZ5c3J4YmJ3bXlneHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NzE3MzAsImV4cCI6MjA5NTA0NzczMH0.b6ZAR5cUjo7wLDM0NtPEfsYJwrPf_Fobjte4w58bHqk";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let numEntries = 0;
const isMobile = window.matchMedia("(max-width: 768px)").matches;

let sleepHours = document.getElementsByClassName("sleep-hours")[0];
let dLabel = document.getElementsByClassName("d-mood")[0];
let bpSleep = document.getElementById("bp-sleep");

let dMood = document.getElementsByName("dMood");
let eMood = document.getElementsByName("eMood");
let aMood = document.getElementsByName("aMood");
let iMood = document.getElementsByName("iMood");
let pMood = document.getElementsByName("pMood");

let addMeds = document.getElementById("add-meds");
let addMedWindow = document.getElementsByClassName("add-medication")[0];
let closeAddWindow = document.getElementById("close-add");

let newMed = document.getElementById("medication-details");

let newMedArea = document.getElementById("new-med-area");
let medItem = document.getElementsByClassName("med-item")[0];
let medItems = document.querySelectorAll("med-item");
let allMeds = [];

let storedMeds;

let siteDate = document.getElementById("date");
let siteTime = document.getElementById("time");

let moodQuestions = document.getElementById("mood-questions");

let moodLabels = moodQuestions.querySelectorAll("label");
let moodInput = moodQuestions.querySelectorAll("input");

let formBlocks = document.querySelectorAll(".form-block");

// let dayData = JSON.parse(localStorage.getItem("dayData")) || {};
let dayData = {};

// let medDetails = JSON.parse(localStorage.getItem("medications")) || [];
let medDetails = [];

let missedDayButton = document.querySelector("#missed-day-button");
let closeMissedDay = document.querySelector("#close-missed");

let missedDayWindow = document.querySelector("#missed-day-block");

let missedMedBlock = document.querySelector(".missed-medication-block");

let dateSelector = document.querySelector("#missed-date");
let missedDate;
let missedInfoButton = document.querySelector("#missed-day-info");
let missedInfo = document.querySelector("#missed-day");

let missedDayData = {};

let missedSleep = document.querySelector("#missed-bp-sleep");
let editingEntryId = null;


let numEntriesBlock = document.getElementById("number-entries");

let previousMonthButton = document.querySelector("#previous-month-button");
let nextMonthButton = document.querySelector("#next-month-button");

let calenderMonthName = document.querySelector("#calender-month");
let calenderBody = document.querySelector(".calender-body");

let nextMonth = document.getElementById("next-month");
let prevMonth = document.getElementById("prev-month");
let monthLabel = document.getElementById("month-label");


let calenderDate = new Date();

const allMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const monthsShort = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

let currentMonth = calenderDate.getMonth();

monthLabel.textContent = allMonths[currentMonth];

console.log(monthsShort[currentMonth]);
async function renderCalendar() {

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const { data, error } = await supabaseClient
    .from("daily_entries")
    .select("*");

    // console.log(data);
    // data.forEach(item=>{
    //   console.log(Number(item["entry_date"].slice(-2)))
    // })

    // const formattedDate = today.toISOString().split("T")[0];

    calenderBody.innerHTML = "";

    let month = calenderDate.getMonth();
    let year = calenderDate.getFullYear();
    let today = calenderDate.getDate();
    

    calenderMonthName.textContent = `${allMonths[month]} ${year}`;

    let numOfDays = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= numOfDays; i++) {


        
        //  let day = new Date(year,month,i).getDay();
        let newDiv = document.createElement("div");
        newDiv.classList.add("calender-cell")

         data.forEach(item=>{
            if(i===Number(item["entry_date"].slice(-2)) && Number(item["entry_date"].split("-")[1]) === month +1){

              newDiv.style.backgroundColor = "rgba(0, 128, 0,.5)";
              newDiv.style.color = "white";

            }


    })      
    
                               
        newDiv.textContent = i;
        // newDiv.appendChild(newSpan);
        calenderBody.appendChild(newDiv);
    }
}

previousMonthButton.addEventListener("click", () => {


    calenderDate.setMonth(calenderDate.getMonth() - 1);

    renderCalendar();
});

nextMonthButton.addEventListener("click", () => {

    calenderDate.setMonth(calenderDate.getMonth() + 1);

    renderCalendar();
});

renderCalendar();

async function getNumEntries() {
  const { count } = await supabaseClient
    .from("daily_entries")
    .select("*", { count: "exact", head: true });

  // console.log(count);

  numEntriesBlock.textContent = count;
}



let visuals = document.getElementById("visuals");

let charts = document.getElementById("charts");
let closeChart = document.getElementById("close-chart");

visuals.onclick = () => {

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  // console.log(isMobile);
  if(isMobile){
    charts.style.display = "flex";
  }else{
  charts.style.display = "grid";
  }
};

closeChart.onclick = () => {
    // console.log("Charts trying to close!");
    if(isMobile){
    charts.style.display = "none";
  }else{
  charts.style.display = "none";
  }
};

formBlocks.forEach((block) => {
  // RANGE INPUT
  let rangeInput = block.querySelector('input[type="range"]');

  if (rangeInput) {
    let label = block.querySelector("label");

    rangeInput.addEventListener("input", () => {
      let value = Number(rangeInput.value);
      // console.log("new value is - ",value);
      if (value < 6) {
        block.style.backgroundColor = "rgba(255, 0, 0,.2)";
      } else if (value >= 6 && value <= 8) {
        block.style.backgroundColor = "rgba(0, 128, 0,.2)";
      } else {
        block.style.backgroundColor = "rgba(0, 0, 255,.2)";
      }

      label.textContent = `Hours slept last night - ${rangeInput.value}`;
    });
}

  // RADIO INPUTS
  let radioInputs = block.querySelectorAll('input[type="radio"]');

  if (radioInputs.length > 0) {
    let heading = block.querySelector("p");

    radioInputs.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.value === "none") {
          // heading.style.color = "green";
          block.style.backgroundColor = "rgba(0, 128, 0,.2)";
        } else if (radio.value === "mild") {
          block.style.backgroundColor = "rgba(255, 255, 0,.2)";
        } else if (radio.value === "moderate") {
          block.style.backgroundColor = "rgba(255, 165, 0,.2)";
        } else if (radio.value === "severe") {
          block.style.backgroundColor = "rgba(255, 0, 0,.2)";
        } else {
          return;
        }

        // if(radio.value === "yes"){

        // }

        let baseText = heading.textContent.split("-")[0];

        heading.textContent = `${baseText} - ${radio.value}`;
      });
    });
  }
});

function currentDate() {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const date = new Date();
  let todayDate = formatter.format(date);

  return todayDate;
}

function nextMonthDate() {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const date = new Date();
  let nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + 1);
  let nextMonth = formatter.format(nextDate);

  return nextMonth;
}

// console.log(nextMonthDate());

// ********************************  WINDOWS ON LOAD FUNCTION *********************************

window.onload = () => {
  getNumEntries();
  // console.log("Current Data stored is", dayData);
  charts.style.display = "none";
  const date = new Date();
  const formatted = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

  siteDate.textContent = formatted;

  function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    const ampm = hours >= 12 ? "PM" : "AM";

    // convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12

    // pad with zero
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    const time = `${hours}:${minutes}:${seconds} ${ampm}`;

    siteTime.textContent = time;
  }

  updateClock(); // run immediately
  setInterval(updateClock, 1000);

  logMed();

  createSleepChart();
  medicationHeatmap();
  moodCharts();
  // fixMedicationBlock();
};

document.addEventListener("change", (e) => {
  if (!e.target.matches('.med-item input[type="radio"]')) return;

  const med = e.target.closest(".med-item");

  if (!med) return;

  if (e.target.value === "yes") {
    med.style.backgroundColor = "rgba(0, 128, 0, .2)";
  } else if (e.target.value === "no") {
    med.style.backgroundColor = "rgba(255, 0, 0, .2)";
  }
});

// ************************* NEW MEDICATION FORM HANDLER *************************************

function validateNewMed(){
   let newMedName = document.getElementById("mName");
   let newMedDose = document.getElementById("mDose");
   let newMedUnit = document.getElementById("mUnit");

   let newMedFrequency = document.querySelector('input[name="frequency"]:checked');
   let newMedTime = document.querySelector('input[name="time"]:checked')

   if(!newMedName.value.trim() || !newMedDose.value.trim() || !newMedUnit.value.trim() || !newMedFrequency || !newMedTime){
    return false;
   }

   return true;
}

newMed.addEventListener("submit", async function (e) {
  e.preventDefault();

  let clearMeds = [...newMedArea.children];

  console.log(typeof clearMeds);
  console.log(clearMeds);

  clearMeds.forEach((item, index) => {
    if (index !== 0) {
      item.remove();
    }
  });

  //   const formData = new FormData(newMed);

  //   const data = {};

  //   formData.forEach((value, key) => {
  //     data[key] = value;
  //   });
    if(!validateNewMed()){
      alert("Complete all the fields of the Form before submitting!");
      return;
    }
  const medication = {
    name: document.getElementById("mName").value.trim(),

    dose: document.getElementById("mDose").value.trim(),

    unit: document.getElementById("mUnit").value.trim(),

    time_of_day:
      document.querySelector('input[name="frequency"]:checked')?.value || null,

    frequency:
      document.querySelector('input[name="time"]:checked')?.value || null,
  };

  console.log(medication);

  const { data, error } = await supabaseClient
    .from("medications")
    .insert([medication]);

  console.log(data);
  console.log(error);

  medDetails.push(medication);

  // localStorage.setItem("medications", JSON.stringify(medDetails));

  // storedMeds = JSON.parse(localStorage.getItem("medications"));

  logMed();
  newMed.reset();

  addMedWindow.style.display = "none";

  //   if(storedMeds.length > 4){
  //     newMedArea.style.gridTemplateColumns = "repeat(3,1fr)";
  //   }

  //   if(storedMeds.length > 8){
  //     newMedArea.style.gridTemplateColumns = "repeat(4,1fr)";
  //   }
});

function fixMedicationBlock() {
  if (storedMeds.length <= 4) {
    newMedArea.style.gridTemplateColumns = "repeat(2,1fr)";
  }

  if (storedMeds.length > 4) {
    newMedArea.style.gridTemplateColumns = "repeat(3,1fr)";
  }

  if (storedMeds.length > 8) {
    newMedArea.style.gridTemplateColumns = "repeat(4,1fr)";
  }
}

// ********************************** LOG MEDICATION *******************************************************

async function logMed() {
  const { data, error } = await supabaseClient.from("medications").select("*");

  if (error) {
    console.log(error);

    return;
  }

  data.forEach((med) => {
    let delMed = document.createElement("i");
    // <i id="close-add"  class="fa-solid fa-xmark"></i>

    // delMed.id = "close-med";
    delMed.classList.add("close-med", "fa-solid", "fa-xmark");
    let medItem = document.createElement("div");
    medItem.classList.add("med-item");
    medItem.dataset.id = med.id;

    let newMedLabel = document.createElement("p");
    newMedLabel.classList.add("med-label");
    newMedLabel.textContent = `${med.name} (${med.dose}${med.unit}) - ${med.frequency} - ${med.time_of_day}`;

    medItem.appendChild(newMedLabel);

    let medItemBlock = document.createElement("div");
    medItemBlock.classList.add("med-item-block");

    let newDiv1 = document.createElement("div");
    let newDiv2 = document.createElement("div");

    const options = ["Yes", "No"];

    options.forEach((option) => {
      const label = document.createElement("label");

      const radio = document.createElement("input");

      radio.type = "radio";

      radio.name = `med-${med.id}`;

      radio.value = option.toLowerCase();

      radio.id = `${option.toLowerCase()}-${med.id}`;

      label.htmlFor = radio.id;

      label.appendChild(radio);

      label.append(` ${option}`);

      if (option === "Yes") {
        newDiv1.appendChild(label);
      } else {
        newDiv2.appendChild(label);
      }
    });
    medItemBlock.appendChild(newDiv1);
    medItemBlock.appendChild(newDiv2);

    medItem.appendChild(medItemBlock);
    medItem.appendChild(delMed);

    newMedArea.appendChild(medItem);

    delMed.onclick = async () => {
      const confirmed = confirm("Delete this medication?");

      if (!confirmed) return;

      const medId = med.id;

      // 1. Delete from Supabase
      const { error } = await supabaseClient
        .from("medications")
        .delete()
        .eq("id", medId);

      if (error) {
        console.log("Delete failed:", error);
        return;
      }

      // 2. Remove from UI
      medItem.remove();

      console.log(`Medication ${medId} deleted`);

      let clearMeds = [...newMedArea.children];

      // console.log(typeof(clearMeds));
      // console.log(clearMeds);

      clearMeds.forEach((item, index) => {
        if (index !== 0) {
          item.remove();
        }
      });

      await logMed();
    };
  });

  // let medStatus = document.querySelectorAll(".med-item-block input");

  // loadMedInfo();
}

bpSleep.addEventListener("change", () => {
  sleepHours.textContent = "";
  sleepHours.textContent = `Hours slept last night - ${bpSleep.value}`;
});

for (let i = 0; i < dMood.length; i++) {
  dMood[i].addEventListener("change", () => {
    dLabel.textContent = "";
    dLabel.textContent = `Today's despressed mood - ${dMood[i].value}`;
  });
}

addMeds.onclick = () => {
  addMedWindow.style.display = "block";
};

closeAddWindow.onclick = () => {
  addMedWindow.style.display = "none";
};

let existingMeds = document.getElementsByName("med");

// console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
// console.log(existingMeds);

function validateForm() {
  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
  console.log("Enter form validation");

  // console.log(bpSleep.value);
  // 1. sleep validation
  if (bpSleep.value < 0.5) {
    console.log("Select sleep hours");
    alert("Form incomplete, Enter hours slept!");
    return false;
  }

  // 2. mood validation
  const groups = [dMood, eMood, iMood, aMood, pMood];

  for (let group of groups) {
    const isGroupChecked = Array.from(group).some((mood) => mood.checked);

    if (!isGroupChecked) {
      console.log("A mood group is not selected");
      alert("Form incomplete, Enter the Mood values");
      return false;
    }
  }

  // 3. medication validation
  const medsValid = validateMeds();

  if (!medsValid) {
    return false;
  }

  return true;
}

function validateMeds() {
  const meds = document.querySelectorAll(".med-item");

  for (let med of meds) {
    const selected = med.querySelector('input[type="radio"]:checked');

    if (!selected) {
      console.log("Medication not selected:", med);
      alert("Enter Medication taken or not");
      return false;
    }
  }
  console.log("Form Validated!");
  return true;
}

// validateForm();

// ***************************************    MAIN FORM HANDLER *********************************************


moodQuestions.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    e.preventDefault(); // stop submission
    console.log("Form blocked");
    return;
  }
  // *********************** NEW CODE ******************************************************

  try {
    // const entry_date = new Date().toISOString().split("T")[0];
    const today = new Date();

    const entry_date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    console.log("Entry Date for new submission is - ", entry_date);
    // const entry_date = new Date().to
    // const today = new Date();
    // today.setDate(today.getDate() - 7);

    // const entry_date = today.toISOString().split("T")[0];

    async function checkDayExists(date) {
    const { data, error } = await supabaseClient
      .from("daily_entries")
      .select("id")
      .eq("entry_date", date)
      .maybeSingle();

    if (error) {
      console.log(error);
      return false;
    }
    
    // console.log("Data found!!", data);
    // return true;
    return data !== null;
  }

  const entryExists = await checkDayExists(entry_date);
   
  if(entryExists){
    alert("Data present for today, Edit in Missed day if required!");
    moodQuestions.reset();
    clearForm();
    return;
  }


    const bp_sleep = Number(document.getElementById("bp-sleep").value);

    const dMood =
      document.querySelector('input[name="dMood"]:checked')?.value || null;
    const eMood =
      document.querySelector('input[name="eMood"]:checked')?.value || null;
    const iMood =
      document.querySelector('input[name="iMood"]:checked')?.value || null;
    const aMood =
      document.querySelector('input[name="aMood"]:checked')?.value || null;
    const pMood =
      document.querySelector('input[name="pMood"]:checked')?.value || null;

    const { data, error } = await supabaseClient
      .from("daily_entries")
      .insert([
        {
          entry_date,
          bp_sleep,
          d_mood: dMood,
          e_mood: eMood,
          i_mood: iMood,
          a_mood: aMood,
          p_mood: pMood,
        },
      ])
      .select();
     
    if (error) {
      console.log("Daily entry error:", error);
      return;
    }

    const dailyEntryId = data[0].id;

    // COLLECT MEDICATION DATA

    const medicationBlocks = document.querySelectorAll(".med-item");

    const medicationRows = [];

    medicationBlocks.forEach((block) => {
      const medicationId = Number(block.dataset.id);

      let medicationName = block
        .querySelector(".med-label")
        .textContent.split(" ")[0];

      const selected = block.querySelector(
        `input[name="med-${medicationId}"]:checked`,
      );

      medicationRows.push({
        daily_entry_id: dailyEntryId,
        medication_id: medicationId,
        medication_name: medicationName,
        taken: selected ? selected.value : null,
      });
    });

    // 4. INSERT MEDICATION DATA

    if (medicationRows.length > 0) {
      const { error: medError } = await supabaseClient
        .from("daily_medications")
        .insert(medicationRows);

      if (medError) {
        console.log("Medication error:", medError);
        return;
      }
    }

    // 5. SUCCESS STATE

    console.log("Daily entry saved successfully");

    moodQuestions.reset();



    // document.querySelector("#new-med-area").innerHTML =
    //     `<legend><button type="button" id="add-meds">Add Medication</button></legend>`;
  } catch (err) {
    console.log("Unexpected error:", err);
  }
  // logMed();
  getNumEntries();

  // ********************************* END OF NEW CODE *************************************

  clearForm();

  // createSleepChart();
  // medicationHeatmap();
  // moodCharts();

  alert("form submitted!");
  renderCalendar();
});

function clearForm(){

    formBlocks.forEach((block) => {
    block.style.backgroundColor = "transparent";

    let rangeInput = block.querySelector('input[type="range"]');

    if (rangeInput) {
      let label = block.querySelector("label");

      label.textContent = `Hours slept last night - ${rangeInput.value}`;
    }

    let radioInputs = block.querySelectorAll('input[type="radio"]');

    if (radioInputs.length > 0) {
      let heading = block.querySelector("p");
      let baseText = heading.textContent.split("-")[0];

      heading.textContent = `${baseText} - Choose`;
    }
  });

  const items = Array.from(newMedArea.children).filter((child) =>
    child.classList.contains("med-item"),
  );

  for (let item of items) {
    item.style.backgroundColor = "transparent";
  }

}



// *********************************************** CHARTS LOGIC *********************************************************

// ******************************************* MONTH NAVIGATION FOR CHARTS **********************************************
let selectedDate = new Date();

// const allMonths = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];

// const monthsShort = [
//   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
// ];
// currentMonth = selectedDate.getMonth();

monthLabel.textContent = allMonths[currentMonth];

function getMonthYear() {
  return {
    month: selectedDate.getMonth() + 1,
    year: selectedDate.getFullYear(),
  };
}


document.getElementById("prev-month").onclick = () => {
  
  selectedDate.setMonth(selectedDate.getMonth() - 1);
  currentMonth = selectedDate.getMonth();
  monthLabel.textContent = allMonths[currentMonth];
  medicationHeatmap();
  createSleepChart();
  moodCharts();
};

document.getElementById("next-month").onclick = () => {
  
  selectedDate.setMonth(selectedDate.getMonth() + 1);
  currentMonth = selectedDate.getMonth();
  monthLabel.textContent = allMonths[currentMonth];
  medicationHeatmap();
  createSleepChart();
  moodCharts();
};



// const today = new Date();

// document.getElementById("next-month").onclick = () => {


//   const testDate = new Date(selectedDate);
//   testDate.setMonth(testDate.getMonth() + 1);

//   if (
//     testDate.getFullYear() > today.getFullYear() ||
//     (
//       testDate.getFullYear() === today.getFullYear() &&
//       testDate.getMonth() > today.getMonth()
//     )
//   ) {
//     return;
//   }

//   selectedDate = testDate;
//   medicationHeatmap();
//   createSleepChart();
//   moodCharts();
// };






// ************************************************ SLEEP CHART **********************************************************

function nod() {
  const currentDate = new Date();

  let month = currentDate.getMonth() + 1;
  let nextMonth = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const daysInMonth = new Date(year, nextMonth, 0).getDate();

  return { month, daysInMonth };
}



let destroyChart;

async function createSleepChart() {
  const labels = [];
  const sleepHours = [];
    let sleepMap = [];

const year = selectedDate.getFullYear();
const month = selectedDate.getMonth();

const daysInMonth = new Date(year, month + 1, 0).getDate();

const startDate =
  `${year}-${String(month + 1).padStart(2, "0")}-01`;

const endDate =
  `${year}-${String(month + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;

  // const { data, error } = await supabaseClient
  //   .from("daily_entries")
  //   .select("bp_sleep, entry_date");

  const { data, error } = await supabaseClient
  .from("daily_entries")
  .select("bp_sleep, entry_date")
  .gte("entry_date", startDate)
  .lte("entry_date", endDate);

  if (error) {
    console.log(error);
    return;
  }

  // console.log(data);

  sleepMap = new Map();

  data.forEach((item) => {
    sleepMap.set(item.entry_date, item.bp_sleep);
  });


  // getSleepValues();

   for (let day = 1; day <= daysInMonth; day++) {
    let formattedDay = String(day).padStart(2, "0");

    let formattedMonth = String(month+1).padStart(2, "0");

    let fullDate = `${year}-${formattedMonth}-${formattedDay}`;

    labels.push(day);

    let sleep = Number(sleepMap.get(fullDate)) || 0;

    sleepHours.push(sleep);
  }

  // console.log("Sleep Hours array - ", sleepHours);

  const ctx = document.getElementById("sleep-chart");

  if (destroyChart) {
    destroyChart.destroy();
  }

  destroyChart = new Chart(ctx, {
    type: "bar",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Low Sleep (<6 hrs)",

          data: sleepHours.map((hours) => {
            return hours < 6 ? hours : null;
          }),

          categoryPercentage: 1,
          barPercentage: 0.9,

          backgroundColor: "rgba(255, 0, 0,1)",

          borderColor: "black",
          borderWidth: 1,
        },

        {
          label: "Good Sleep (6-8 hrs)",

          data: sleepHours.map((hours) => {
            return hours >= 6 && hours <= 8 ? hours : null;
          }),

          categoryPercentage: 1,
          barPercentage: 0.9,

          backgroundColor: "rgba(0, 128, 0,1)",

          borderColor: "black",
          borderWidth: 1,
        },

        {
          label: "Over Sleep (>8 hrs)",

          data: sleepHours.map((hours) => {
            return hours > 8 ? hours : null;
          }),

          categoryPercentage: 1,
          barPercentage: 0.9,

          backgroundColor: "rgba(0, 0, 255,1)",

          borderColor: "black",
          borderWidth: 1,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        title: {
          display: true,
          text: "Sleep Duration For Entire Month",
          color: "black",
          font: {
            size: 16,
            weight: "bold",
          },
        },

        legend: {
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: {
              size: 14,
              weight: "bold",
            },
          },
        },
      },

      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Day of Month",

            font: {
              size: 16,
              weight: "bold",
            },
          },
        },

        y: {
          stacked: true,
          beginAtZero: true,

          max: 12,

          ticks: {
            stepSize: 1,
          },

          title: {
            display: true,
            text: "Hours Slept",

            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
      },
    },
  });
}



function buildMedicationScatter(data) {
  const dates = Object.keys(data);

  // console.log("Heat Map dates", dates);

  const medsSet = new Set();

  dates.forEach((date) => {
    Object.keys(data[date]).forEach((key) => {
      if (key !== "bp-sleep" && !key.includes("Mood")) {
        medsSet.add(key);
      }
    });
  });

  const meds = [...medsSet];

  const scatterData = [];

  dates.forEach((date) => {
    const day = Number(date.split("/")[0]);

    meds.forEach((med, medIndex) => {
      const value = data[date]?.[med];

      scatterData.push({
        x: day,

        y: medIndex + 1,

        med: med,

        taken: value,

        backgroundColor:
          value === "yes" ? "rgba(0, 128, 0,1)" : value === "no" ? "rgba(255, 0, 0,1)" : "gray",
      });
    });
  });

  return {
    meds,
    scatterData,
  };
}






// ****************************** HEAT MAP FOR MEDICATIONS *********************************

let desMedicationChart;


async function medicationHeatmap() {

let currentMonth = nod();
const heatmapData = {};

const year = selectedDate.getFullYear();
const month = selectedDate.getMonth();

const startDate =
  `${year}-${String(month + 1).padStart(2, "0")}-01`;

const endDate =
  `${year}-${String(month + 1).padStart(2, "0")}-${String(
    new Date(year, month + 1, 0).getDate()
  ).padStart(2, "0")}`;


// const { data, error } = await supabaseClient
//   .from("daily_medications")
//   .select(`
//     taken,
//     medications!daily_medications_medication_id_fkey (
//       name
//     ),
//     daily_entries!daily_medications_daily_entry_id_fkey (
//       entry_date
//     )
//   `);

const { data, error } = await supabaseClient
  .from("daily_medications")
  .select(`
    taken,
    medications!daily_medications_medication_id_fkey (
      name
    ),
    daily_entries!daily_medications_daily_entry_id_fkey (
      entry_date
    )
  `)
  .gte("daily_entries.entry_date", startDate)
  .lte("daily_entries.entry_date", endDate);


  if (error) {
  console.log("Supabase error:", error);
  return;
}

if (!data) {
  console.log("No data returned from daily_medications");
  return;
}

// console.log("Data:", data);
// console.log("Error:", error);

  data.forEach((row) => {
    if (!row.daily_entries) return;
  const rawDate = row.daily_entries.entry_date;

  // convert YYYY-MM-DD → DD/MM/YYYY
  const [year, month, day] = rawDate.split("-");

  const formattedDate = `${day}/${month}/${year}`;

  if (!heatmapData[formattedDate]) {
    heatmapData[formattedDate] = {};
  }
  if (!row.medications) return;

  heatmapData[formattedDate][row.medications.name] = row.taken;
});














const daysInMonth = new Date(
  year,
  month + 1,
  0
).getDate();

  const canvas = document.getElementById("medication-chart");

  const { meds, scatterData } = buildMedicationScatter(heatmapData);

  const existingChart = Chart.getChart(canvas);

  if (existingChart) {
    existingChart.destroy();
  }

  desMedicationChart = new Chart(canvas, {
    type: "scatter",

    data: {
      datasets: [
        {
          label: "Medication",

          data: scatterData,

          pointRadius: 10,

          pointStyle: "rect",

          pointHoverRadius: 12,

          pointBackgroundColor: scatterData.map(
            (point) => point.backgroundColor,
          ),
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        title: {
          display: true,
          text: "Medication Compliance",
          color: "black",
          font: {
            size: 16,
            weight: "bold",
          },
        },

        tooltip: {
          callbacks: {
            label: (ctx) => {
              const raw = ctx.raw;

              return `${raw.med} : ${raw.taken}`;
            },
          },
        },

        legend: {
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: { size: 10 },
            generateLabels: function (chart) {
              return [
                {
                  text: "Taken",
                  fillStyle: "rgba(0, 128, 0,1)",
                  strokeStyle: "black",
                  lineWidth: 1,
                },
                {
                  text: "Not Taken",
                  fillStyle: "rgba(255, 0, 0,1)",
                  strokeStyle: "black",
                  lineWidth: 1,
                },
              ];
            },
          },
        },
      },

      scales: {
        x: {
          min: 1,
          max: daysInMonth,

          ticks: {
            stepSize: 1,
          },

          grid: {
            offset: false,
          },

          title: {
            display: true,
            text: "Day",
          },
        },

        y: {
          min: 1,
          max: meds.length,
          offset: true,

          ticks: {
            stepSize: 1,

            callback: (value) => {
              let x = Math.ceil(value);

              // console.log("Y axis - ",value);
              // return (`${meds[x - 1]}(${medDetails[x-1][time]})`);
              return meds[x - 1];
            },
          },

          title: {
            display: true,
            text: "Medication",
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
      },
    },
  });
}

// medicationHeatmap();







// **************************************** MOODS CHARTS ************************************************

let desMoodChart1, desMoodChart2, desMoodChart3, desMoodChart4, desMoodChart5;

async function moodCharts() {
  // console.log("Dummy Data");
  // console.log(dummyData);

  // let {data,error} = await supabaseClient.from("daily_entries").select("*");

  const year = selectedDate.getFullYear();
const month = selectedDate.getMonth();

const daysInMonth = new Date(year, month + 1, 0).getDate();

const startDate =
  `${year}-${String(month + 1).padStart(2, "0")}-01`;

const endDate =
  `${year}-${String(month + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;

  let { data, error } = await supabaseClient
  .from("daily_entries")
  .select("*")
  .gte("entry_date", startDate)
  .lte("entry_date", endDate);

  // console.log("Data in the moods table is");
  // console.log(data);

  const labels = [];
  const severityMap = {
    none: 1,
    mild: 2,
    moderate: 3,
    severe: 4,
  };

  const depressionValues = [];
  const elavatedValues = [];
  const irritabilityValues = [];
  const anxietyValues = [];
  const psychoticValues = [];

  // const current = new Date();
  // const month = String(current.getMonth() + 1).padStart(2, "0");
  // const year = current.getFullYear();

  // const daysInMonth = new Date(year, current.getMonth() + 1, 0).getDate();

  const normalizeDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};




  let moodsMap = new Map();
  data.forEach((entry) => {
  // moodsMap.set(entry.entry_date, entry);
  // moodsMap.set(normalizeDate(entry.entry_date), entry);
  moodsMap.set(entry.entry_date, entry);
});

// console.log("Mood Map - ",moodsMap);


  // for(let day = 1; day <= daysInMonth; day++){
  for (let day = 1; day <= daysInMonth; day++) {
    let formattedDay = String(day).padStart(2, "0");
    let formattedMonth = String(month+1).padStart(2,"0");
    let fullDate = `${year}-${formattedMonth}-${formattedDay}`;


    labels.push(day);

    depressionValues.push(severityMap[moodsMap.get(fullDate)?.d_mood]?? null);
    elavatedValues.push(severityMap[moodsMap.get(fullDate)?.e_mood]?? null);
    irritabilityValues.push(severityMap[moodsMap.get(fullDate)?.i_mood]?? null);
    anxietyValues.push(severityMap[moodsMap.get(fullDate)?.a_mood]?? null);
    psychoticValues.push(severityMap[moodsMap.get(fullDate)?.p_mood]?? null);



  }

  function displayChart(chartId, chartLabel, chartTitle, values, dc) {
    const ctx = document.getElementById(chartId);

    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }
    return new Chart(ctx, {
      type: "bar",

      data: {
        labels: labels,

        datasets: [
          {
            label: chartLabel,

            data: values,

            backgroundColor: values.map((value) => {
              if (value === 1) {
                return "rgba(0, 128, 0,1)";
              } else if (value === 2) {
                return "rgba(255, 255, 0,1)";
              } else if (value === 3) {
                return "rgba(255, 165, 0,1)";
              }

              return "rgba(255, 0, 0,1)";
            }),

            categoryPercentage: 1,
            barPercentage: 0.9,

            borderColor: "black",
            borderWidth: 1,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          title: {
            display: true,
            text: chartTitle,
            color: "black",
            font: {
              size: 12,
              weight: "bold",
            },
          },

          legend: {
            // position: "left",
            position: isMobile ? "top" : "left",

            labels: {
              boxWidth: 10,
              boxHeight: 10,

              font: {
                size: 10,
                // weight: "bold"
              },

              generateLabels: function (chart) {
                return [
                  {
                    text: "None",
                    fillStyle: "rgba(0, 128, 0,1)",
                    strokeStyle: "black",
                    lineWidth: 1,
                  },

                  {
                    text: "Mild",
                    fillStyle: "rgba(255, 255, 0,1)",
                    strokeStyle: "black",
                    lineWidth: 1,
                  },

                  {
                    text: "Moderate",
                    fillStyle: "rgba(255, 165, 0,1)",
                    strokeStyle: "black",
                    lineWidth: 1,
                  },

                  {
                    text: "Severe",
                    fillStyle: "rgba(255, 0, 0,1)",
                    strokeStyle: "black",
                    lineWidth: 1,
                  },
                ];
              },
            },
          },
        },

        scales: {
          x: {
            // stacked: true,
            title: {
              display: true,
              text: "Day of Month",

              font: {
                size: 8,
                weight: "bold",
              },
            },
          },

          y: {
            // stacked: true,
            // beginAtZero: true,

            max: 4,

            ticks: {
              stepSize: 1,
              font: { size: 10 },

              callback: function (value) {
                const labels = {
                  1: "None",
                  2: "Mild",
                  3: "Moderate",
                  4: "Severe",
                };

                return labels[value];
              },
            },

            title: {
              display: false,
              text: `${chartLabel} Moods`,

              font: {
                size: 12,
                weight: "bold",
              },
            },
          },
        },
      },
    });
  }

  desMoodChart1 = displayChart(
    "depression-chart",
    "Depression",
    "Depression Moods for Entire Month",
    depressionValues,
    desMoodChart1,
  );

  desMoodChart2 = displayChart(
    "elevated-chart",
    "Elevated",
    "Elevated Moods for Entire Month",
    elavatedValues,
    desMoodChart2,
  );

  desMoodChart3 = displayChart(
    "irritability-chart",
    "Irritability",
    "Irritability Moods for Entire Month",
    irritabilityValues,
    desMoodChart3,
  );

  desMoodChart4 = displayChart(
    "anxiety-chart",
    "Anxiety",
    "Anxiety Moods for Entire Month",
    anxietyValues,
    desMoodChart4,
  );

  desMoodChart5 = displayChart(
    "psychotic-chart",
    "Psychotic Symptoms",
    "Psychotic Moods for Entire Month",
    psychoticValues,
    desMoodChart5,
  );
}

// function missedData(){
//  *************************** MISSED DAY LOGIC ********************************************

missedDayButton.onclick = async () => {
  missedDayWindow.style.display = "block";

  missedMedBlock.innerHTML = "";

  let flag = await loadMissedMeds();

   if(flag){
        let elements = missedInfo.elements;

    for (let element of elements) {
      element.disabled = true;
    }

  }
  
};

async function loadMissedMeds() {

    const { data, error } = await supabaseClient
      .from("medications")
      .select("*");

    // console.log(data);

    if (error) {
      console.log(error);
      return false;
    }

    data.forEach((med, index) => {
      // console.log("value of Index is - ", index);
      let newDiv = document.createElement("div");
      newDiv.classList.add("missed-med");
      newDiv.dataset.id = med.id;

      let newLabel = document.createElement("label");
      newLabel.htmlFor = `missed-${med.name}`;
      newLabel.textContent = med.name;

      let newSelect = document.createElement("select");
      newSelect.id = `missed-${med.name}`;
      newSelect.name = `missed-${med.name}`;

      let options = ["Yes", "No"];

      let firstOp = document.createElement("option");
      firstOp.value = "";
      firstOp.hidden = true;
      firstOp.selected = true;
      // firstOp.disabled = true;
      firstOp.textContent = "Choose";

      newSelect.appendChild(firstOp);

      options.forEach((item) => {
        let option = document.createElement("option");
        option.value = item.toLowerCase();
        option.textContent = item;

        newSelect.appendChild(option);
      });

      newDiv.appendChild(newLabel);
      newDiv.appendChild(newSelect);

      missedMedBlock.appendChild(newDiv);
    });

    
    return true;
}




closeMissedDay.onclick = () => {
  missedInfo.reset();
  dateSelector.value = "";
  missedDayWindow.style.display = "none";

};


// ******************************* DATE SELECTOR LOGIC ***************************************


dateSelector.addEventListener("change", async (e) => {
missedDate = e.target.value;
let response;

async function checkDayExists(date) {
    const { data, error } = await supabaseClient
      .from("daily_entries")
      .select("*")
      .eq("entry_date", date)
      .maybeSingle();

    if (error) {
      console.log(error);
      return false;
    }
    
    // console.log("Data found!!", data);
    return data;
  }

  const entryExists = await checkDayExists(missedDate);

  console.log("Entry exits is - ",entryExists);

let shouldProceed = true;

if(entryExists) {
  shouldProceed = confirm(
    "Data already exists for this day. Do you want to edit it?"
  );
}


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  Fill the form with previous values ^^^^^^^^^^^^^^^^^^^^^^^^^^
if(shouldProceed){
  
   let elements = missedInfo.elements;

    for (let element of elements) {
      element.disabled = false;
    }

const { data: entry, error: entryError } = await supabaseClient
  .from("daily_entries")
  .select("*")
  .eq("entry_date", missedDate)
  .maybeSingle();

if (entryError) {
  console.log(entryError);
  return;
}

if (!entry) {
  editingEntryId = null;
} else {
  editingEntryId = entry.id;
}

const medsTaken = await supabaseClient.from("daily_medications").select("*").eq("daily_entry_id", entry.id);

console.log("Meds taken from Date selector",medsTaken);

const meds = await supabaseClient.from("medications").select("*");

// console.log("Medication are - ",meds)

const takenMap = new Map();

medsTaken.data.forEach(row => {
  takenMap.set(row.medication_id, row.taken);
});

console.log("Taken Map is - ",takenMap);
const medBlock = document.querySelector(".missed-medication-block");
medBlock.innerHTML = "";

meds.data.forEach((med) => {
  const div = document.createElement("div");
  div.classList.add("missed-med");
  div.dataset.id = med.id;


  const takenValue = takenMap.get(med.id) ?? "no";

      // console.log(">> Taken value is - ",takenValue)

  div.innerHTML = `
    <label>${med.name}</label>
    <select data-med-id="${med.id}">
      <option value"" hidden disabled>Choose</option>
      <option value="no">No</option>
      <option value="yes">Yes</option>
    </select>
  `;

  const select = div.querySelector("select");
  select.value = takenValue;

  medBlock.appendChild(div);
});



function normalise(word) {
  if (!word) return "";
  return word.charAt(0).toLowerCase() + word.slice(1).toLowerCase();
}

document.getElementById("missed-bp-sleep").value = entry.bp_sleep ?? 0;

document.getElementById("md-Mood").value = normalise(entry.d_mood) ?? "";
document.getElementById("me-Mood").value = normalise(entry.e_mood) ?? "";
document.getElementById("mi-Mood").value = normalise(entry.i_mood) ?? "";
document.getElementById("ma-Mood").value = normalise(entry.a_mood) ?? "";
document.getElementById("mp-Mood").value = normalise(entry.p_mood) ?? "";


} else {
    dateSelector.value = "";
    return;
}

});

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ End Fill the form with previous values ^^^^^^^^^^^^^^^^^^^^^^^^^^



// ************************************* Validate Missed form ***************************************

function missedFormValidate() {
  if (missedSleep.value <= 0 || missedSleep.value > 14) {
    alert("Enter valid sleep value between 0-14");
    return false;
  }

  const otherOptions = missedInfo.querySelectorAll("select");

  for (let item of otherOptions) {
    //  console.log("Missed Form item",item);
    if (item.value === "") {
      alert("Please enter all the values!");
      // item.style.backgroundColor = "rgba(255, 0, 0,.2)";
      return false;
    }
  }
  return true;
}


//  ********************************** SUBMIT MISSED DAY ENTRY *******************************************


missedInfo.addEventListener("submit", async (e) => {
  e.preventDefault();

  let x = missedFormValidate();

  console.log("Form Status - ", x);

  if (!x) {
    console.log("Form Blocked, as incomplete!");
    return;
  }

  try {

  let entry_date = missedDate;

    const bp_sleep = Number(document.getElementById("missed-bp-sleep").value);

    const dMood = document.querySelector('[name="dep-mood"]')?.value || null;
    const eMood = document.querySelector('[name="ele-mood"]')?.value || null;
    const iMood = document.querySelector('[name="irr-mood"]')?.value || null;
    const aMood = document.querySelector('[name="anx-mood"]')?.value || null;
    const pMood = document.querySelector('[name="psy-mood"]')?.value || null;

    

     let data, error;

if (editingEntryId) {
  // UPDATE EXISTING ENTRY

  const response = await supabaseClient
    .from("daily_entries")
    .update({
      bp_sleep,
      d_mood: dMood,
      e_mood: eMood,
      i_mood: iMood,
      a_mood: aMood,
      p_mood: pMood,
    })
    .eq("id", editingEntryId)
    .select();

  data = response.data;
  error = response.error;

} else {
  // CREATE NEW ENTRY

  const response = await supabaseClient
    .from("daily_entries")
    .insert([
      {
        entry_date,
        bp_sleep,
        d_mood: dMood,
        e_mood: eMood,
        i_mood: iMood,
        a_mood: aMood,
        p_mood: pMood,
      },
    ])
    .select();

  data = response.data;
  error = response.error;
}

    if (error) {
      console.log("Daily entry error:", error);
      return;
    }

    // const dailyEntryId = data[0].id;
    const dailyEntryId = editingEntryId || data?.[0]?.id;

    console.log("DAILY ENTRY ID -", dailyEntryId);

    // COLLECT MEDICATION DATA

    const medicationBlocks = document.querySelectorAll(".missed-med");

    const medicationRows = [];

    medicationBlocks.forEach((block) => {
      const medicationId = Number(block.dataset.id);

      // let medicationName = block
      //   .querySelector(".med-label")
      //   .textContent.split(" ")[0];

      let medicationName = block.querySelector("label").textContent;

      // const selected = block.querySelector(
      //   `input[name="med-${medicationId}"]:checked`,
      // );

      const selected = block.querySelector("select").value;

      medicationRows.push({
        daily_entry_id: dailyEntryId,
        medication_id: medicationId,
        medication_name: medicationName,
        taken: selected || null,
      });
    });

    // 4. INSERT MEDICATION DATA

    // if (medicationRows.length > 0) {


    //   const { error: medError } = await supabaseClient
    //     .from("daily_medications")
    //     .insert(medicationRows);

    //   if (medError) {
    //     console.log("Medication error:", medError);
    //     return;
    //   }
    // }

    if (medicationRows.length > 0) {
      if (editingEntryId) {
        // DELETE OLD MEDICATION ROWS FIRST
        const { error: deleteError } = await supabaseClient
          .from("daily_medications")
          .delete()
          .eq("daily_entry_id", dailyEntryId);

        if (deleteError) {
          console.log("Medication delete error:", deleteError);
          return;
        }
      }

      // INSERT FRESH ROWS
      const { error: medError } = await supabaseClient
        .from("daily_medications")
        .insert(medicationRows);

      if (medError) {
        console.log("Medication error:", medError);
        return;
      }
    }

    // 5. SUCCESS STATE

    console.log("Missed entry saved successfully");

  } catch (err) {
    console.log("Unexpected error:", err);
  }

   createSleepChart();
   medicationHeatmap();
   moodCharts();

  alert("Missed Entry submitted successfully!");
  getNumEntries();
  dateSelector.value = "";
  missedInfo.reset();
  missedDayWindow.style.display = "none";
  renderCalendar();
});
