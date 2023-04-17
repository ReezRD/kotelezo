<template>
  <div>
    <h1>Home</h1>

    <div>
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">Writer</th>
            <th scope="col">Title</th>
            <th scope="col">Year</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>writer</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

// import { useUrlStore } from "@/stores/url";
// import { useLoginStore } from "@/stores/login";
// const storeUrl = useUrlStore();
// const storeLogin = useLoginStore();
// export default {
//   data() {
//     return {
//       storeUrl,
//       storeLogin,
//       Opus: [],
//     };
//   },
//   mounted() {
//     this.getOpus();
//   },
//   methods: {
//     async getOpus() {
//       let url = this.storeUrl.urlOpus;
//       const config = {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${this.storeLogin.accessToken}`,
//         },
//       };
//       const response = await fetch(url, config);
//       const data = await response.json();
//       this.opus = data.data;
//     },
//   },
// };
// v-for="(oneopus, index) in opusWithSpecimen" :key="`opus${index}`"
</script>

<style></style>
