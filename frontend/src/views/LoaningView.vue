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
      JoinEverything: [],
    };
  },
  mounted() {
    this.getEverything();
  },
  methods: {
    async getEverything() {
      let url = this.storeUrl.urlEverything;
      const config = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.storeLogin.accessToken}`,
        },
      };
      const response = await fetch(url, config);
      const data = await response.json();
      this.JoinEverything = data.data;
    },
  },
};
</script>

<template>
  <div>
    <h1>Loanings</h1>

    <div id="datatable" class="w-75 ">
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>Student name</th>
            <th>Title</th>
            <th>Specimen Id</th>
            <th>Away</th>
            <th>Back</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody v-for="(student, index) in JoinEverything" :key="`student${index}`">
          <tr>
            <td>{{ student.name }}</td>
            <td>{{ student.title }}</td>
            <td>{{ student.specimentid }}</td>
            <td>{{ student.away }}</td>
            <td>{{ student.back }}</td>
            <td><button type="button" class="btn btn-success"><i class="bi bi-pen"></i></button></td>
            <td><button type="button" class="btn btn-danger"><i class="bi bi-x-circle"></i></button></td>
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