import Loader from 'react-loader-spinner'
import {Component} from 'react'
import './index.css'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    last7DaysVaccinationData: [],
    vaccinationByAge: [],
    vaccinationByGender: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getFormatedData = data => ({
    vaccineDate: data.vaccine_date,
    dose1: data.dose_1,
    dose2: data.dose_2,
  })

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    const fetchedData = await response.json()

    if (response.ok === true) {
      this.setState({apiStatus: apiStatusConstants.success})
      const updatedData = fetchedData.last_7_days_vaccination.map(eachData =>
        this.getFormatedData(eachData),
      )
      this.setState({
        last7DaysVaccinationData: updatedData,
        vaccinationByAge: fetchedData.vaccination_by_age,
        vaccinationByGender: fetchedData.vaccination_by_gender,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-img"
      />
      <p>Something went wrong</p>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container">
      <div testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
      </div>
    </div>
  )

  renderVaccinationData = () => {
    const {
      apiStatus,
      last7DaysVaccinationData,
      vaccinationByAge,
      vaccinationByGender,
    } = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return (
          <>
            <VaccinationCoverage vaccinationData={last7DaysVaccinationData} />
            <VaccinationByGender data={vaccinationByGender} />
            <VaccinationByAge data={vaccinationByAge} />
          </>
        )
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="co-win-dashboard">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="logo"
            />
            <p className="logo-name">Co-Win</p>
          </div>
          <h1 className="heading">CoWIN Vaccination in India</h1>
          {this.renderVaccinationData()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
