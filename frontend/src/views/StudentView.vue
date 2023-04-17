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
      Students: [],
    };
  },
  mounted() {
    this.getStudents();
  },
  methods: {
    async getStudents() {
      let url = this.storeUrl.urlStudents;
      const config = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.storeLogin.accessToken}`,
        },
      };
      const response = await fetch(url, config);
      const data = await response.json();
      this.Students = data.data;
    },
  },
};
</script>

<template>
    <div>
      <h1>Students</h1>
  
      <div id="datatable" class="w-50">
        <table class="table table-dark table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Year</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="(student, index) in Students" :key="`student${index}`">
            <tr>
              <td>{{ student.name }}</td>
              <td>{{ student.year }}</td>
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
