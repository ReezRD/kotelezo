<script>
import { useUrlStore } from "@/stores/url";
import { useLoginStore } from "@/stores/login";
const storeUrl = useUrlStore();
const storeLogin = useLoginStore();
export default {
  data() {
    return {
      storeUrl,
      storeLogin,
      SpecimenOpusJoin: [],
    };
  },
  mounted() {
    this.getSpecimenOpusJoin();
  },
  methods: {
    async getSpecimenOpusJoin() {
      let url = this.storeUrl.urlSpecimenOpusJoin;
      const config = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.storeLogin.accessToken}`,
        },
      };
      const response = await fetch(url, config);
      const data = await response.json();
      this.SpecimenOpusJoin = data.data;
    },
  },
};
</script>

<template>
  <div>
    <h1>Specimen</h1>

    <div id="datatable" class="w-75">
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Acquisition</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody v-for="(specimen, index) in SpecimenOpusJoin" :key="`specimen${index}`">
          <tr>
            <td>{{ specimen.title }}</td>
            <td>{{ specimen.acquisition }}</td>
            <td>{{ specimen.price }} Ft</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: white;
  text-align: center;
}

#datatable{
  margin: auto;
}

</style>