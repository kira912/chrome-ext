<template>
  <v-container fluid>
    <v-data-iterator
      :items="filterTypes"
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
          <v-toolbar class="d-flex justify-start" rounded>
            <ChipsFilterTypeRequest @typeSelected="handleTypeFilter" />
          </v-toolbar>
        </v-col>
      </template>

      <template v-slot:default="props">
        <TimingNavigation :currentTab="currentTab"></TimingNavigation>
        <v-expansion-panels
          rounded
          class="mb-5 request"
          multiple
          focusable
          max-width="100%"
        >
        <v-card>
          <v-expansion-panel
            v-for="(request, index) in props.items"
            :key="index"
            @click="displayBottomSheet(request)"
          >
            <v-expansion-panel-header>
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
            </v-expansion-panel-header>
            <v-expansion-panel-content class="ma-15">
              <v-row>
                {{request}}
                <RequestTimingNavigation :timing="request.timing" />
              </v-row>
              <v-row justify="center">
                <RequestInformation
                  :from="request.initiator"
                  :to="request.url"
                  :method="request.method"
                  :status="request.statusCode"
                />
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-card rounded>
                    <v-card-title class="grey darken-3">
                      <span class="title font-weight-light"
                        >Request Headers</span
                      >
                    </v-card-title>
                    <v-list-item
                      v-for="(
                        requestHeaders, index
                      ) in request.requestHeaders"
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
                  <v-card rounded>
                    <v-card-title class="grey darken-3">
                      <span class="title font-weight-light"
                        >Response Headers</span
                      >
                    </v-card-title>
                    <v-list-item
                      v-for="(
                        responseHeader, index
                      ) in request.responseHeadersReceived"
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

                <v-col cols="4" v-if="request.requestBody">
                  <v-row>
                    <RequestBody :requestBody="request.requestBody" />
                  </v-row>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card>
        </v-expansion-panels>
      </template>

      <template v-slot:footer>
        <v-row
          class="mt-2"
          align="center"
          justify="center"
        >
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>fa-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span
            class="mr-4
            grey--text"
          >
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>fa-chevron-left</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="ml-1"
            @click="nextPage"
          >
            <v-icon>fa-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import RequestBody from '@/components/RequestBody'
import RequestInformation from '@/components/RequestInformation'
import ChipsFilterTypeRequest from '@/components/ChipsFilterTypeRequest'
import TimingNavigation from '@/components/TimingNavigation'
import RequestTimingNavigation from '@/components/RequestTimingNavigation'

export default {
  name: 'RequestRow',
  components: {
    RequestBody,
    RequestInformation,
    ChipsFilterTypeRequest,
    TimingNavigation,
    RequestTimingNavigation
  },
  props: {
    requests: {
      type: Array,
      required: true
    },
    timingPage: {
      type: Object
    },
    currentTab: {
      type: Number
    }
  },
  data: () => ({
    itemsPerPageArray: [4, 8, 12, 50, 100, 200],
    search: '',
    filter: {},
    sortDesc: false,
    sortBy: '',
    page: 1,
    itemsPerPage: 12,
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
  }
}
</script>
