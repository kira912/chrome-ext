<template>
  <v-card elevation="20" rounded>
    <v-card-title class="grey darken-3">
      <span class="title font-weight-light">Request Body</span>
    </v-card-title>
    <v-list-item
      v-for="(body, index) in bodyData"
      :key="index"
    >
      <v-list-item-content>
        <v-row>
          <v-col cols="3">
            <p class="font-weight-bold">
              {{ body.name }}
            </p>
          </v-col>
          <v-col cols="5">
            <p>{{ body.value }}</p>
          </v-col>
        </v-row>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  props: {
    requestBody: {
      type: Object
    }
  },
  data: () => ({
    bodyData: []
  }),
  mounted () {
    if (this.requestBody !== undefined && 'formData' in this.requestBody) {
      console.log(this.requestBody)
      for (const data in this.requestBody.formData) {
        this.bodyData.push({ name: data, value: this.requestBody.formData[data] })
      }
    }
  }
}
</script>
