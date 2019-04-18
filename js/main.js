const calcRodoTime = (st_hour, st_min, ed_hour, ed_min) => {
  const inOfficeTime = calcInOfficeTime(st_hour, st_min, ed_hour, ed_min)
  return rodoTimeFromRule(inOfficeTime)
}

const calcInOfficeTime = (st_hour, st_min, ed_hour, ed_min) => {
  return reduceToMin(ed_hour, ed_min) - reduceToMin(st_hour, st_min)
}

const reduceToMin = (hour, min) => hour * 60 + min
const restoreHourFromMin = (totalMin) => {
  min = totalMin % 60
  hour = (totalMin - min) / 60
  return [hour, min]
}

const hourStr = (hour, min) => {
  if (min < 0) {
    return `-${('' + hour).slice(-1)}:${('0' + (-min)).slice(-2)}`
  } else {
    return `${('' + hour).slice(-1)}:${('0' + min).slice(-2)}`
  }
}
const rodoTimeFromRule = (inOfficeTime) => {
  if (inOfficeTime < reduceToMin(8, 30)) {
    return inOfficeTime - 45
  } else if (inOfficeTime < reduceToMin(8, 45)) {
    return reduceToMin(7, 45)
  } else {
    return inOfficeTime - 60
  }
}

const calcOverTime = (rodoTime) => rodoTime - reduceToMin(7, 45)

const app = new Vue({
  el: '#app',
  template: `
    <div class="myApp">
      <form class="myForm">
        <input class="myInput" v-model.number="st_hour">:
        <input class="myInput" v-model.number="st_min">~
        <input class="myInput" v-model.number="ed_hour">:
        <input class="myInput" v-model.number="ed_min">
      </form>
      <p>労働時間: {{ rodoTimeStr }}</p>
      <p class="red">残業時間: {{ overTimeStr }}</p>
      <p class="blue" v-if="wasteTimeStr">無駄になった時間: {{ wasteTimeStr }}分</p>
    </div>
    `,
  
  data: {
    st_hour: 8,
    st_min: 50,
    ed_hour: 17,
    ed_min: 30,
  },
  methods: {
  },
  computed: {
    rodoTime: function() {
      return calcRodoTime(this.st_hour, this.st_min, this.ed_hour, this.ed_min)
    },
    rodoTimeStr: function() {
      const rodoTime = calcRodoTime(this.st_hour, this.st_min, this.ed_hour, this.ed_min)
      return hourStr(...restoreHourFromMin(rodoTime))
    },
    overTimeStr: function() {
      const rodoTime = calcRodoTime(this.st_hour, this.st_min, this.ed_hour, this.ed_min)
      const overTime = calcOverTime(rodoTime)
      if (overTime <= 0) {
        return hourStr(...restoreHourFromMin(overTime))
      } else {
        return '+' + hourStr(...restoreHourFromMin(overTime))
      }
    },
    wasteTimeStr: function() {
      const inOfficeTime = calcInOfficeTime(this.st_hour, this.st_min, this.ed_hour, this.ed_min)
      const rodoTime = calcRodoTime(this.st_hour, this.st_min, this.ed_hour, this.ed_min)
      if (inOfficeTime < reduceToMin(8, 45)) {
        return '' + (inOfficeTime - rodoTime - 45)
      }
      return ''
    }
  },
})