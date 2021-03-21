<template>
  <v-container fluid>
    <v-data-iterator
      :items="requests"
      :items-per-page.sync="itemsPerPage"
      :page="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar dark color="blue darken-3" class="mb-1">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn large depressed color="blue" :value="false">
                <v-icon>fa-arrow-up</v-icon>
              </v-btn>
              <v-btn large depressed color="blue" :value="true">
                <v-icon>fa-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-expansion-panels id="requests" hover focusable popout multiple>
          <v-expansion-panel
            v-for="(request, index) in props.items"
            :key="index"
            class="mb-5 request"
            elevation="10"
            hover
            max-width="100%"
          >
            <v-expansion-panel-header>
              <v-row justify="space-around">
                <v-chip :color="getCardBackgroundColor(request.statusCode)">
                  {{ request.statusCode }}
                </v-chip>
                <h2>{{ request.type }}</h2>
                <h2>{{ request.initiator }}</h2>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="4">
                  <v-card rounded>
                    <v-card-title class="blue darken-3">
                      <span class="title font-weight-light">Request Headers</span>
                    </v-card-title>
                    <v-list-item
                      v-for="(requestHeaders, index) in request.requestHeaders"
                      :key="index"
                    >
                      <v-list-item-content>
                        <v-row>
                          <v-col>
                            <p class="font-weight-bold">{{ requestHeaders.name }}</p>
                          </v-col>
                          <v-col cols="10">
                            <p>{{ requestHeaders.value }}</p>
                          </v-col>
                        </v-row>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card elevation="20" rounded>
                    <v-card-title class="blue darken-3">
                      <span class="title font-weight-light">Response Headers</span>
                    </v-card-title>
                    <v-list-item
                      v-for="(
                        responseHeader, index
                      ) in request.responseHeadersReceived"
                      :key="index"
                    >
                      <v-list-item-content>
                        <v-row>
                          <v-col>
                            <p class="font-weight-bold">{{ responseHeader.name }}</p>
                          </v-col>
                          <v-col cols="10">
                            <p>{{ responseHeader.value }}</p>
                          </v-col>
                        </v-row>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
export default {
  name: "RequestRow",
  props: {
    requests: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    itemsPerPageArray: [4, 8, 12, 50, 100, 200],
    search: "",
    filter: {},
    sortDesc: false,
    sortBy: "",
    page: 1,
    itemsPerPage: 50,
    keys: ["Method", "StatusCode", "IP", "Date", "Url", "Type"],
    currentRequestHeaderValue: null,
    currentResponseHeadersReceived: null,
  }),
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    getCardBackgroundColor(requestCode) {
      const mapping = {
        200: "#00ab2e",
        500: "#d10000",
        404: "#d10000",
      };

      return mapping[requestCode];
    },
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.requests.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },
  },
  mounted() {
    console.log(this.requests);
  },
};
</script>

<style lang="sass" scoped>
fontPurple
  color: #7b1fa2
</style>
