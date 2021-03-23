<template>
  <v-row>
     <v-chip-group
      multiple
      active-class="primary--text"
    >
      <v-chip
        v-for="(type, index) in requestType"
        :key="index"
        @click="getTypeRequestSelected(type)"
      >
        {{type}}
      </v-chip>
     </v-chip-group>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    requestType: ['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping', 'csp_report', 'media', 'websocket', 'other'],
    typeSelected: []
  }),
  methods: {
    getTypeRequestSelected (type) {
      if (!this.typeSelected.includes(type)) {
        this.typeSelected.push(type)
      } else {
        this.typeSelected.splice(this.typeSelected.indexOf(type), 1)
      }
      this.$emit('typeSelected', this.typeSelected)
    }
  }
}
</script>
