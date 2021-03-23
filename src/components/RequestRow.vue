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
        <v-col>
          <v-toolbar rounded dark>
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
                  <v-btn large depressed :value="false">
                    <v-icon>fa-arrow-up</v-icon>
                  </v-btn>
                  <v-btn large depressed :value="true">
                    <v-icon>fa-arrow-down</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </template>
          </v-toolbar>
          <v-toolbar rounded >
            <ChipsFilterTypeRequest @typeSelected="handleTypeFilter" />
          </v-toolbar>
        </v-col>
      </template>

      <template v-slot>
        <v-list
          rounded
          class="mb-5 request"
          elevation="10"
          hover
          max-width="100%"
          dark
        >
          <v-list-item
            v-for="(request, index) in filterTypes"
            :key="index"
            @click="displayBottomSheet(request)"
          >
            <v-col cols="1" class="d-flex justify-start">
              <v-chip :color="getStatusCodeColor(request.statusCode)">
                {{ request.statusCode }}
              </v-chip>
            </v-col>
            <v-col cols="1">
              <v-chip :color="getMethodColor(request.method)">
                <h2>{{ request.method }}</h2>
              </v-chip>
            </v-col>
            <v-col cols="2">
              <h2>{{ request.type }}</h2>
            </v-col>
            <v-col cols="6">
              <p>{{ request.url }}</p>
            </v-col>
            <v-col>
              <p>{{ getRequestDate(request.timeStamp) }}</p>
            </v-col>
            <v-col cols="1" class="d-flex justify-end">
              <v-icon @click="removeRequestFromList(request)"
                >fa-times-circle</v-icon
              >
            </v-col>
          </v-list-item>
          <v-bottom-sheet
            v-if="currentRequestSheet"
            v-model="sheet"
            scrollable
            dark
          >
            <v-sheet class="overflow-auto text-center" fullscreen hide-overlay>
              <!-- <Charts :timing="currentRequestSheet.timing"></Charts> -->
              <v-row>
                <RequestInformation
                  :from="currentRequestSheet.initiator"
                  :to="currentRequestSheet.url"
                  :method="currentRequestSheet.method"
                  :status="currentRequestSheet.statusCode"
                />
              </v-row>
              <v-row>
              </v-row>
              <v-row>
                <v-col elevation="20" cols="4">
                  <v-card rounded>
                    <v-card-title class="grey darken-3">
                      <span class="title font-weight-light"
                        >Request Headers</span
                      >
                    </v-card-title>
                    <v-list-item
                      v-for="(
                        requestHeaders, index
                      ) in currentRequestSheet.requestHeaders"
                      :key="index"
                    >
                      <v-list-item-content>
                        <v-row>
                          <v-col>
                            <p class="font-weight-bold">
                              {{ requestHeaders.name }}
                            </p>
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
                    <v-card-title class="grey darken-3">
                      <span class="title font-weight-light"
                        >Response Headers</span
                      >
                    </v-card-title>
                    <v-list-item
                      v-for="(
                        responseHeader, index
                      ) in currentRequestSheet.responseHeadersReceived"
                      :key="index"
                    >
                      <v-list-item-content>
                        <v-row>
                          <v-col cols="4">
                            <p class="font-weight-bold">
                              {{ responseHeader.name }}
                            </p>
                          </v-col>
                          <v-col cols="6">
                            <p>{{ responseHeader.value }}</p>
                          </v-col>
                        </v-row>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <RequestBody :requestBody="currentRequestSheet.requestBody" />
                </v-col>
              </v-row>
            </v-sheet>
          </v-bottom-sheet>
        </v-list>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
// import Charts from './Charts'
import RequestBody from './RequestBody'
import RequestInformation from './RequestInformation'
import ChipsFilterTypeRequest from '../components/ChipsFilterTypeRequest'

export default {
  name: 'RequestRow',
  components: {
    // Charts,
    RequestBody,
    RequestInformation,
    ChipsFilterTypeRequest
  },
  props: {
    requests: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    itemsPerPageArray: [4, 8, 12, 50, 100, 200],
    search: '',
    filter: {},
    sortDesc: false,
    sortBy: '',
    page: 1,
    itemsPerPage: 50,
    keys: ['Method', 'StatusCode', 'IP', 'Date', 'Url', 'Type'],
    currentRequestHeaderValue: null,
    currentResponseHeadersReceived: null,
    sheet: false,
    currentRequestSheet: null,
    requestTypeFilter: []
  }),
  methods: {
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },
    getStatusCodeColor (requestCode) {
      const mapping = {
        200: '#00ab2e',
        500: '#d10000',
        404: '#d10000'
      }

      return mapping[requestCode]
    },
    getMethodColor (method) {
      const mapping = {
        GET: '#61affe',
        POST: '#49cc90',
        DELETE: '#f93e3e',
        PUT: '#fca130',
        PATCH: '#fca130'
      }

      return mapping[method]
    },
    removeRequestFromList (request) {
      this.requests.splice(this.requests.indexOf(request), 1)
    },
    displayBottomSheet (request) {
      this.sheet = !this.sheet
      this.currentRequestSheet = request
    },
    getRequestDate (timestamp) {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      }
      return new Intl.DateTimeFormat('fr-FR', options).format(
        new Date(timestamp)
      )
    },
    handleTypeFilter (types) {
      this.requestTypeFilter = types
    }
  },
  computed: {
    numberOfPages () {
      return Math.ceil(this.requests.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter((key) => key !== 'Name')
    },
    filterTypes () {
      return this.requests.filter(request => {
        if (this.requestTypeFilter.length === 0) {
          return request
        }

        return this.requestTypeFilter.includes(request.type)
      })
    }
  },
  mounted () {
    console.log(this.requests)
  }
}
</script>

<style lang="sass" scoped>
getColor
  background-color: #49cc90
</style>
