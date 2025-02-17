import "./styles.css"

let dropMenu = document.querySelector(".menu")

dropMenu.addEventListener("click", function () {
  let contentNodes = document.querySelectorAll(".content")

  for (let node of contentNodes) {
    node.classList.toggle("hidden")
  }
})

const form = document.getElementById("validationForm")
const email = document.getElementById("email")
const country = document.getElementById("country")
const zip = document.getElementById("zip")
const password = document.getElementById("password")
const confirmPassword = document.getElementById("confirmPassword")
const successMessage = document.getElementById("successMessage")

function validateEmail() {
  if (!email.value.trim()) {
    email.setCustomValidity("Email is required.")
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    email.setCustomValidity("Please enter a valid email address.")
  } else {
    email.setCustomValidity("")
  }
  email.reportValidity()
}

function validateCountry() {
  if (!country.value.trim()) {
    country.setCustomValidity("Country is required.")
  } else {
    country.setCustomValidity("")
  }
  country.reportValidity()
}

function validateZip() {
  const zipPattern = /^\d{5}$/ // Matches 5-digit zip codes
  if (!zip.value.trim()) {
    zip.setCustomValidity("Zip code is required.")
  } else if (!zipPattern.test(zip.value)) {
    zip.setCustomValidity("Zip code must be exactly 5 digits.")
  } else {
    zip.setCustomValidity("")
  }
  zip.reportValidity()
}

function validatePassword() {
  if (!password.value.trim()) {
    password.setCustomValidity("Password is required.")
  } else if (password.value.length < 8) {
    password.setCustomValidity("Password must be at least 8 characters.")
  } else {
    password.setCustomValidity("")
  }
  password.reportValidity()
}

function validateConfirmPassword() {
  if (!confirmPassword.value.trim()) {
    confirmPassword.setCustomValidity("Please confirm your password.")
  } else if (confirmPassword.value !== password.value) {
    confirmPassword.setCustomValidity("Passwords do not match.")
  } else {
    confirmPassword.setCustomValidity("")
  }
  confirmPassword.reportValidity()
}

// Add real-time validation to each input field
email.addEventListener("input", () => {
  validateEmail()
  email.reportValidity()
})

country.addEventListener("input", () => {
  validateCountry()
  country.reportValidity()
})

zip.addEventListener("input", () => {
  validateZip()
  zip.reportValidity()
})

password.addEventListener("input", () => {
  validatePassword()
  password.reportValidity()
})

confirmPassword.addEventListener("input", () => {
  validateConfirmPassword()
  confirmPassword.reportValidity()
})

form.addEventListener("submit", (event) => {
  // Run all validations before submission
  validateEmail()
  validateCountry()
  validateZip()
  validatePassword()
  validateConfirmPassword()

  // If the form is invalid, prevent submission
  if (!form.checkValidity()) {
    event.preventDefault()
  } else {
    alert("High five! Form submitted successfully!")
  }
})

console.log(
  "Ive watched a lot of videos today, tomorrow I'll be the best version of myself",
  "Im bout to be incredible",
)

function getWeather() {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve("Sunny")
    }, 100)
  })
}

function getWeatherIcon(weather) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      switch (weather) {
        case "Sunny":
          resolve(":D")
          break
        case "Cloudy":
          resolve(":/")
          break
        case "Rainy":
          resolve(":C")
          break
        default:
          reject("NO ICON FOUND")
      }
    }, 100)
  })
}

function onSuccess(data) {
  console.log(`Success: ${data}`)
}

function onError(error) {
  console.log(`Error: ${error}`)
}

//getWeather().then(getWeatherIcon).then(onSuccess, onError)
function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

function makeOrder() {
  console.log("I want a pepperoni pizza")
  return "Pepperoni"
}

function takeOrder() {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      let value = makeOrder()
      console.log(`Order taken!, ${value} pizza on the way`)
      resolve(`${value}`)
    }, 100)
  })
}

function preparePizza(order) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      console.log(`${order} Pizza is Ready!`)
      resolve(`${order}`)
    }, 3000)
  })
}

function deliverPizza(order) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      let num = getRandomInt(2)
      if (num === 0) {
        console.log(`${order} Pizza delivered!`)
        resolve("success")
      } else if (num === 1) {
        console.log(`Delivery failed!`)
        reject("The delivery never arrived :C")
      }
    }, 3000)
  })
}

takeOrder().then(preparePizza).then(deliverPizza).catch(onError)
