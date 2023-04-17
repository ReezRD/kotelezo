import { defineStore } from "pinia";

export const useUrlStore = defineStore({
  id: "url",
  state: () => ({
    urlData: "http://localhost:3000",
    urlAuth: "http://localhost:4000",
  }),
  getters: {
    urlLogin() {
      return `${this.urlAuth}/login`;
    },
    urlLogout() {
      return `${this.urlAuth}/logout`;
    },
    urlToken() {
      return `${this.urlAuth}/token`;
    },
    urlOpus(){
      return `${this.urlData}/opus`
    },
    urlSpecimen(){
      return `${this.urlData}/Specimen`
    },
    urlOpusWithSpecimen(){
      return `${this.urlData}/opusWithSpecimen`
    },
    urlOpusSpecimen(){
      return `${this.urlData}/opusSpecimen`
    },
    // urlCarsWithDrivers(){
    //   return `${this.urlData}/carsWithDrivers`
    // },
    // urlCarsWithDriversReal(){
    //   return `${this.urlData}/carsWithDriversReal`
    // },
    urlSpecimenOpusJoin(){
      return `${this.urlData}/SpecimenOpusJoin`
    },
    urlLoaning(){
      return `${this.urlData}/Loaning`
    },
    urlLoaningWithStudent(){
      return `${this.urlData}/LoaningWithStudent`
    },
    urlStudents(){
      return `${this.urlData}/Students`
    },
    urlEverything(){
      return `${this.urlData}/JoinEverything`
    },
    urlOpusFirstOffset(){
      return `${this.urlData}/OpusFirstOffset`
    },
    urlOpusSecondOffset(){
      return `${this.urlData}/OpusSecondOffset`
    },
    urlOpusThirdOffset(){
      return `${this.urlData}/OpusThirdOffset`
    }

    // urlFreeDriversAbc(){
    //   return `${this.urlData}/freeDriversAbc`
    // },
    // urlTripsByCarId(){
    //   return `${this.urlData}/tripsByCarId`
    // },
    // urlTrips(){
    //   return `${this.urlData}/trips`
    // }
  },
});
