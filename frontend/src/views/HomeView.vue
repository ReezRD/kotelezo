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
      Opus: [],
    };
  },
  mounted() {
    this.getOpus();
  },
  methods: {
    async getOpus() {
      let url = this.storeUrl.urlOpus;
      const config = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.storeLogin.accessToken}`,
        },
      };
      const response = await fetch(url, config);
      const data = await response.json();
      this.Opus = data.data;
    },
  },
};
</script>

<template>
  <div>
    <h1>Books</h1> 

  <div id="datatable" class="w-75">
    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th>Writer</th>
          <th>Title</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody v-for="(opus, index) in Opus" :key="`opus${index}`">
        <tr>
          <td>{{ opus.writer }}</td>
          <td>{{ opus.title }}</td>
          <td>{{ opus.year }}</td>
        </tr>
      </tbody>
      </table>
    </div>
    <nav aria-label="Page navigation example">
  <ul class="pagination justify-content-center">
    <li class="page-item disabled">
      <a class="page-link">Previous</a>
    </li>
    <li class="page-item"><RouterLink class="page-link" to="/Specimen">1</RouterLink></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#">Next</a>
    </li>
  </ul>
</nav>
  </div>
</template>

<style scoped>
h1 {
  color: white;
  text-align: center;
}

#datatable {
  margin: auto;
}
</style>
