import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import AxiosInstance from "./../../../Api/Axios/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import style from "./Nominee.module.css";
import { validatePANOrAadhaar } from "../../validation/Validation";
import ButtonUI from "../../ui/Button.component";
import { useRouter } from "next/router";
import ReactSlider from "react-slider";
import { connect } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorModal from "../../../components/ui/Modal/ErrorModal.component";
import MaskedInput from "react-text-mask";
import {
  HIDE_ERROR_MODAL,
  SET_ERROR,
  SHOW_ERROR_MODAL,
} from "../../../Redux/Landing";
import GetUserDataFromLocalStorage from "../../../global/localStorage/GetUserDataFromLocalStorage";
import GetSessionIdFromSessionStorage from "../../../global/localStorage/GetSessionIdFromSessionStorage";
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";
import Loader from "../../ui/Loader/Loader.component";
import moment from 'moment';
import { mobileRegister, nomineeList, preview } from "../../../global/path/redirectPath";

const AddNominee = (props) => {
  const autoCorrectedDatePipe = createAutoCorrectedDatePipe("dd/mm/yyyy HH:MM");
  let defaultValue, editSliderMaxValue, disabled, editSliderThumb
  // maximum nominee count can be configured from environment variable
  const [editMode, setEditMode] = useState(false);
  const [nomineeNumberToEdit, setNomineeNumberToEdit] = useState();
  const maxNomineeCount = 3;

  // Code for date picker min and max date settings

  const yyMax = moment().subtract(18, "y").format("YYYY")//guardian age should be greater than 18 
  const yyMin = moment().subtract(99, "y").format("YYYY");//guardian age should be less than  99 
  const dd = moment().format("DD");
  const mm = moment().format("MM")



  // slider % of nominee shares
  const [nominee1Share, setNominee1Share] = useState(100);
  const [nominee2Share, setNominee2Share] = useState(0);
  const [nominee3Share, setNominee3Share] = useState(0);

  const [showPanErrorMsgNominee, setShowPanErrorMsgNominee] = useState(false);
  const [showPanErrorMsgGuardian, setShowPanErrorMsgGuardian] = useState(false);

  // for storing relationships that allow to add (coming form APi)
  const [nomineeRelationship, setNomineeRelationship] = useState([]);

  // for hide and show guardian form (only show in case nominee's age < 18)
  const [showGuardianForm, setShowGuardianForm] = useState(false);

  // for checking nominee is 18+ or not
  const [isMinor, setIsMinor] = useState(false);

  //for identifying selected Document for verification ex- pan card or Aadhaar card
  const [selectedDocumentNominee, setSelectedDocumentNominee] = useState(null);

  const [selectedDocumentGuard, setSelectedDocumentGuard] = useState(null);

  //for already added nominee count which will get from nominee list api
  const [nomineeCount, setNomineeCount] = useState(0); // Already added coming from get

  // for custom Pan or Aadhaar validation if error button disabled
  const [isError, setError] = useState(false);

  const [addedNominee, setAddedNominee] = useState([]);

  const [NomineeNumberToBeEdit, setNomineeNumberToBeEdit] = useState();
  const [NomineeDataToBeEdit, setNomineeDataToBeEdit] = useState();

  const [sessionId, setSessionId] = useState("");
  const [user, setUser] = useState();
  const [IndicatorArr, setIndicatorArr] = useState([]);

  const [Loading, setLoading] = useState(false);

  const [redirectTo, setRedirectTo] = useState("");

  const router = useRouter();

  const Error = (
    <>
      {props.showError && props.error ? (
        <ErrorModal
          redirectTo={props.redirectTo}
          errorMsg={props.errorMsg}
          onClick={props.hideErrorModal}
        />
      ) : null}
    </>
  );

  useEffect(() => {
    if (router.query.hasOwnProperty("edit")) {
      setEditMode(true);
      setNomineeNumberToEdit(router.query.edit);
    }
    if (router.query.hasOwnProperty("redirect")) {
      setRedirectTo(router.query.redirect);
    }
    const localUserData = GetUserDataFromLocalStorage("user") || "";
    const session = GetSessionIdFromSessionStorage("session") || "";

    (!localUserData || localUserData === "") && (props.setError({
      redirectTo: mobileRegister,
      isError: true,
      ErrorMsg: process.env.errorMessage,
      showHide: true,
    }))
    const userData =
      localUserData && typeof localUserData === "string"
        ? JSON.parse(localUserData)
        : localUserData;
    setUser(userData);


    session && setSessionId(session.session_id);

    // for animation of fields
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
      item.className += " animate__fadeInUp animate__delay_" + index;
    });
  }, []);

  useEffect(() => {
    if (nomineeCount === maxNomineeCount && !editMode) {
      setLoading(true);
      void router.push(nomineeList);
    }
  }, [nomineeCount, editMode]);

  useEffect(() => {
    if (nomineeCount && typeof nomineeCount === "number") {
      let Indicator_Array = [];
      let nomCount = nomineeCount;
      if (editMode) nomCount--;
      switch (nomCount) {
        case 0:
          Indicator_Array.push(
            <ul key={1} className={style.nomineesWrap}>
              <li className={`center ${style.nominees}`}>
                <p className={style.perOrange}>100%</p>
                <p className={style.nomineeNum}>Nominee 1</p>
              </li>
            </ul>
          );
          break;
        case 1:
          Indicator_Array.push(
            <ul key={2} className={style.nomineesWrap}>
              <li className={style.nominees}>
                <p className={style.perOrange}>{nominee1Share}%</p>
                <p className={style.nomineeNum}>Nominee 1</p>
              </li>

              <li className={style.nominees}>
                <p className={style.perBlue}>{nominee2Share}%</p>
                <p className={style.nomineeNum}>Nominee 2</p>
              </li>
            </ul>
          );
          break;
        case 2:
          Indicator_Array.push(
            <ul key={3} className={style.nomineesWrap}>
              <li className={style.nominees}>
                <p className={style.perOrange}>{nominee1Share}%</p>
                <p className={style.nomineeNum}>Nominee 1</p>
              </li>

              <li className={style.nominees}>
                <p className={style.perBlue}>{nominee2Share}%</p>
                <p className={style.nomineeNum}>Nominee 2</p>
              </li>

              <li className={style.nominees}>
                <p className={style.perGreen}>{nominee3Share}%</p>
                <p className={style.nomineeNum}>Nominee 3</p>
              </li>
            </ul>
          );
          break;
      }
      setIndicatorArr(Indicator_Array);
    }
  }, [nomineeCount, nominee1Share, nominee2Share, nominee3Share]);

  const getRelationships = async () => {
    const { data } = await AxiosInstance.get(
      `/signup/static/nominee/relationships`
    );
    setNomineeRelationship(data.relationships);
  };

  const alreadyExistedNomineeData = async () => {
    const { data } = await AxiosInstance.post(
      `/signup/user/nominee/details`,

      { phone: user.phone }
    );
    const alreadyAddedNomineeCount = data.nominee_data.length;
    const alreadyAddedNomineeData = data.nominee_data;
    setNomineeCount(alreadyAddedNomineeCount);
    setAddedNominee(alreadyAddedNomineeData);

    if (editMode) {
      if (router.query.edit > alreadyAddedNomineeCount) {
        void router.push(nomineeList);
        return;
      }

      if (router.query.hasOwnProperty("edit")) {
        NomineeDataForEdit(alreadyAddedNomineeData[router.query.edit - 1]);
        setNomineeNumberToBeEdit(router.query.edit - 1);
      } else {
        router.push(nomineeList);
      }

      switch (alreadyAddedNomineeCount) {
        case 1:
          setNominee1Share(alreadyAddedNomineeData[0].nominee_share);
          defaultValue = 100;
          editSliderMaxValue = 100;
          disabled = true;
          editSliderThumb = [];

          break;
        case 2:
          setNominee1Share(alreadyAddedNomineeData[0].nominee_share);
          setNominee2Share(alreadyAddedNomineeData[1].nominee_share);
          defaultValue = nominee1Share;
          disabled = false;
          editSliderMaxValue = 99;
          editSliderThumb = ["Rightmost thumb"];

          break;
        case 3:
          setNominee1Share(alreadyAddedNomineeData[0].nominee_share);
          setNominee2Share(alreadyAddedNomineeData[1].nominee_share);
          setNominee3Share(alreadyAddedNomineeData[2].nominee_share);
          defaultValue = [nominee1Share, nominee1Share + nominee2Share];
          disabled = false;
          editSliderMaxValue = 99;
          editSliderThumb = ["Leftmost thumb", "Rightmost thumb"];
          break;
      }
    } else {
      switch (alreadyAddedNomineeCount) {
        case 0:
          setNominee1Share(100);
          break;
        case 1:
          setNominee1Share(50);
          setNominee2Share(50);
          break;
        case 2:
          setNominee1Share(34);
          setNominee2Share(33);
          setNominee3Share(33);
          break;
      }
    }
  };

  useEffect(() => {
    // get relationships data for binding to dropdown
    if (sessionId && user) {
      // get already added nominees data
      void getRelationships();
      void alreadyExistedNomineeData();
    }
  }, [sessionId]);

  let validationObject = {
    relationship: yup.string().required(),
    nomineeName: yup.string().required(),
    dob: yup.string().required(),
    nomineeAddress: yup.string().required(),
    panOrAadhaar: yup.string().required(),
  };
  const guardianValidation = {
    guardRelationship: yup.string().required(),
    guardName: yup.string().required(),
    guardDob: yup.string().required(),
    guardPanOrAadhaar: yup.string().required(),
    guardAddress: yup.string().required(),
  };

  // if nominee is minor then we need to validate nominee detail as well as guardian detail.else only validate nominee detail
  if (showGuardianForm) {
    validationObject = Object.assign(validationObject, guardianValidation);
  } else {
    validationObject = Object.assign(validationObject);
  }
  const NomineeSchema = yup.object().shape(validationObject);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    setError: setFormError,
    formState: { errors, isValid },
    trigger,
    getValues,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      relationship: "",
      nomineeName: "",
      dob: null,
      nomineeAddress: "",
      panOrAadhaar: "",
      guardRelationship: "",
      guardName: "",
      guardDob: null,
      guardPanOrAadhaar: "",
      guardAddress: "",
    },
    resolver: yupResolver(NomineeSchema),
  });

  const changeDateFormat = (dob) => {
    if (dob) {
      const Changed_Dob = dob.split(/\//);
      return new Date(
        Changed_Dob[2] + "/" + Changed_Dob[1] + "/" + Changed_Dob[0]
      );
    }
  };

  const NomineeDataForEdit = (data) => {
    const { nominee_minor } = data;
    setNomineeDataToBeEdit(data);

    if (nominee_minor) {
      setIsMinor(true);
      setShowGuardianForm(true);
      setValue("nomineeName", data.name, { shouldValidate: true });

      setValue("nomineeAddress", data.address, {
        shouldValidate: true,
      });
      setValue("panOrAadhaar", data.identification_no, {
        shouldValidate: true,
      });
      setValue("relationship", data.relation, {
        shouldValidate: true,
      });

      const capitalize = (string) => {
        return string && string[0].toUpperCase() + string.slice(1);
      };
      setValue(
        "guardRelationship",
        capitalize(data.nominee_guardian_details.guardian_relation),
        {
          shouldValidate: true,
        }
      );
      setValue("guardName", data.nominee_guardian_details.guardian_name, {
        shouldValidate: true,
      });

      setValue("dob", changeDateFormat(data.dob), {
        shouldValidate: true,
      });

      setValue(
        "guardDob",
        changeDateFormat(data.nominee_guardian_details.guardian_dob),
        {
          shouldValidate: true,
        }
      );
      setValue(
        "guardPanOrAadhaar",
        data.nominee_guardian_details.guardian_identification_no,
        {
          shouldValidate: true,
        }
      );
      setValue("guardAddress", data.nominee_guardian_details.guardian_address, {
        shouldValidate: true,
      });
    } else {
      setValue("nomineeName", data.name);
      setValue("dob", changeDateFormat(data.dob), {
        shouldValidate: true,
      });
      setValue("nomineeAddress", data.address, {
        shouldValidate: true,
      });
      setValue("panOrAadhaar", data.identification_no, {
        shouldValidate: true,
      });
      setValue("relationship", data.relation, {
        shouldValidate: true,
      });
    }
  };
  const identifyType = () => {
    let IDType;
    if (editMode) {
      IDType = NomineeDataToBeEdit.identification_type;
    } else {
      IDType = selectedDocumentNominee === "A" ? "aadhar" : "pan";
    }
    return IDType;
  };

  const onSubmit = async (data) => {
    // try {
    // here we are using nominee count+1 because of each time new nominee added hence previous nominee count + 1

    const countInterpolation = editMode
      ? `nominee${nomineeNumberToEdit}Share`
      : `nominee${nomineeCount + 1}Share`;
    let nominee_data = {
      name: data.nomineeName,
      relation: data.relationship,
      dob: new Date(data.dob)
        .toLocaleDateString("es-CL")
        .replace(/-/g, "/")
        .toString(),
      address: data.nomineeAddress,
      identification_type: await identifyType(),
      identification_no: data.panOrAadhaar,
      nominee_minor: isMinor,

      zipcode: "400012",
      nominee_share: eval(countInterpolation),
    };
    let Guard_data;
    debugger
    if (isMinor) {
      Guard_data = {
        nominee_guardian_details: {
          guardian_identification_no: data.guardPanOrAadhaar,
          // guardian_dob: data.guardDob.toLocaleDateString(),
          guardian_dob: new Date(data.guardDob)
            .toLocaleDateString("es-CL")
            .replace(/-/g, "/")
            .toString(),
          guardian_identification_type:
            selectedDocumentGuard === "A" ? "aadhar" : "pan",
          guardian_name: data.guardName,
          guardian_address: data.guardAddress,
          guardian_relation: data.guardRelationship,
          guardian_zipcode: "400012",
        },
      };
    } else {
      Guard_data = {
        nominee_guardian_details: {},
      };
    }
    const responseObj = Object.assign(nominee_data, Guard_data);

    if (nomineeCount !== 0 && addedNominee.length !== 0) {
      // here we are changing previous store nominee share data
      // addedNominee store all nominee data that already added by user and index is used since index start with 0 (adding index + 1)
      addedNominee.map((nominee, index) => {
        const nomineeCountInterpolation = `nominee${index + 1}Share`;

        nominee.nominee_share = eval(nomineeCountInterpolation);
      });
    }

    if (editMode) {
      addedNominee.splice(NomineeNumberToBeEdit, 1, responseObj);
      const data = { phone: user.phone, nominee_data: [...addedNominee] };

      try {
        setLoading(true);
        const resp = await AxiosInstance.post(`/signup/user/nominee/add`, {
          phone: user.phone,
          nominee_data: [...addedNominee],
        });

        if (resp.status === 200) {
          setLoading(false);
          redirectTo === "P"
            ? void router.push(preview)
            : void router.push(nomineeList);
        } else {
          setLoading(false);
          props.setError({
            isError: true,
            ErrorMsg: resp.error.message,
            showHide: true,
          });
        }
      } catch (error) {
        setLoading(false);

        props.setError({
          isError: true,
          ErrorMsg: error.message,
          showHide: true,
        });


      }
    } else {
      try {
        setLoading(true);
        const resp = await AxiosInstance.post(`/signup/user/nominee/add`, {
          phone: user.phone,
          nominee_data: [...addedNominee, responseObj],
        });

        if (resp.status === 200) {
          setLoading(false);
          void router.push(nomineeList);
        } else {
          setLoading(false);
          props.setError({
            isError: true,
            ErrorMsg: resp.error.message,
            showHide: true,
          });
        }
      } catch (error) {
        setLoading(false);
        props.setError({
          isError: true,
          ErrorMsg: error.message,
          showHide: true,
        });
      }
    }
  };

  //  checkAge method accepts date of birth and Type
  //  for Nominee 'N' and Guardian 'G'
  const checkAge = (date, type) => {
    if (date !== null && date !== undefined) {
      let dob = moment(date)
      let today = moment()
      let difference = today.diff(dob, 'years')
      if (type === "N") {
        if (difference < 18) {
          setShowGuardianForm(true);
          setIsMinor(true);
        } else {
          setShowGuardianForm(false);
          setIsMinor(false);
        }
        void trigger("dob");
      } else if (type === "G") {
        if (difference < 18) {
          setError(true);
          setFormError("Guardian_Age_Should_18", {
            message: "Guardian's age should be greater than 18",
          });
        } else {
          clearErrors("Guardian_Age_Should_18");
        }
        void trigger("guardDob");
      } else {
        setIsMinor(false);
      }
    }
  };
  const handleInput = (share, Number_Of_nominee_Already_Exist) => {
    if (editMode) {
      if (Number_Of_nominee_Already_Exist === 1) {
        setNominee1Share(share[0]);
      } else if (Number_Of_nominee_Already_Exist === 2) {
        setNominee1Share(share);
        setNominee2Share(100 - share);
      } else {
        setNominee1Share(share[0]);
        setNominee2Share(share[1] - share[0]);
        setNominee3Share(100 - share[1]);
      }
    } else {
      if (Number_Of_nominee_Already_Exist === 0) {
        setNominee1Share(share[0]);
      } else if (Number_Of_nominee_Already_Exist === 1) {
        setNominee1Share(share);
        setNominee2Share(100 - share);
      } else {
        setNominee1Share(share[0]);
        setNominee2Share(share[1] - share[0]);
        setNominee3Share(100 - share[1]);
      }
    }
  };

  const CheckNomineeName = (name) => {
    const found = addedNominee.some((nominee) => nominee.name === name);
    if (found) {
      setFormError("Nominee_Name_Already_Exist", {
        message: "Name already exist",
      });
    } else {
      clearErrors("Nominee_Name_Already_Exist");
    }
  };

  const CheckNomineeIsApplicant = (name) => {
    if (user.panName === name) {
      setFormError("Nominee_Can_Not_Applicant", {
        message: "Nominee can't be Applicant",
      });
    } else {
      clearErrors("Nominee_Can_Not_Applicant");
    }
  };

  const CompareWithNomineeName = (GuardName) => {
    const nomineeName = getValues("nomineeName");
    if (nomineeName === GuardName) {
      setFormError("Guard_Name_Same_As_Nominee", {
        message: "Guardian Name can not be same as Nominee Name",
      });
    } else if (user.panName === GuardName) {
      setFormError("Guard_Name_Same_As_Nominee", {
        message: "Guardian Can Not be applicant",
      });
    } else {
      clearErrors("Guard_Name_Same_As_Nominee");
    }
  };

  return (
    <>
      {Error}
      {Loading && <Loader />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="ContainerBG">
          {/* body bg */}

          {/* mini container */}
          <div className="containerMini addNominee">
            <h2 className="title animate__animated pb20">
              {editMode
                ? `Edit nominee ${nomineeNumberToEdit}`
                : `Add nominee ${nomineeCount + 1}`}
            </h2>

            <div className={`animate__animated ${style.inputWrap}`}>
              <label
                aria-label="Relationship With Nominee"
                className="form-label"
                htmlFor="relationshipWithNominee"
              >
                Relationship with nominee
              </label>
              <div className="form-select">
                <select
                  aria-label="Select Relationship"
                  id="relationshipWithNominee"
                  className="form-control"
                  name="relationship"
                  onFocus={() => trigger("relationship")}
                  {...register("relationship", { required: true })}
                >
                  <option value="">Select Relationship</option>
                  {nomineeRelationship.map((relation, index) => (
                    <option key={index} value={relation}>
                      {relation}
                    </option>
                  ))}
                </select>
              </div>

              {errors.relationship && (
                <span className={style.error}>Relationship is required</span>
              )}
            </div>

            <div className={`animate__animated ${style.inputWrap}`}>
              <label
                aria-label="Nominee Name"
                className="form-label"
                htmlFor="nomineeName"
              >
                Nominee name
              </label>

              <input
                aria-label="Nominee Name"
                id="nomineeName"
                className="form-control"
                placeholder="Enter name"
                {...register("nomineeName", {
                  required: true,
                })}
                maxLength={60}
                onChange={(e) => {
                  setValue(
                    "nomineeName",
                    e.target.value.replace(/[^a-z ]/gi, ""),
                    { shouldValidate: true }
                  );
                  if (!editMode) {
                    CheckNomineeName(e.target.value);
                  }
                  CheckNomineeIsApplicant(e.target.value);
                }}
              />

              {errors.Nominee_Name_Already_Exist && (
                <span className={style.error}>
                  {errors.Nominee_Name_Already_Exist?.message}
                </span>
              )}

              {errors.Nominee_Can_Not_Applicant && (
                <span className={style.error}>
                  {errors.Nominee_Can_Not_Applicant?.message}
                </span>
              )}

              {errors.nomineeName && (
                <span className={style.error}>Nominee name is required</span>
              )}
            </div>

            <div
              className={`animate__animated datepickerWrap ${style.inputWrap}`}
            >
              <label
                aria-label="Date Of birth"
                className="form-label"
                htmlFor="dobNominee1"
              >
                Date of birth
              </label>
              <Controller
                control={control}
                name="dob"
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker
                    className="form-control"
                    placeholderText="DD/MM/YYYY"
                    onChange={(date) => {
                      setValue("dob", new Date(date));
                      field.onChange(date);
                    }}
                    onCalendarClose={() => {
                      checkAge(getValues("dob"), "N");
                    }}
                    onBlur={() => {
                      checkAge(getValues("dob"), "N");
                      void trigger("dob");
                    }}
                    onDayMouseEnter={() => {
                      checkAge(getValues("dob"), "N");
                      void trigger("dob");
                    }}
                    onClickOutside={() => {
                      checkAge(getValues("dob"), "N");
                      void trigger("dob");
                    }}
                    customInput={
                      <MaskedInput
                        pipe={autoCorrectedDatePipe}
                        mask={[
                          /\d/,
                          /\d/,
                          "/",
                          /\d/,
                          /\d/,
                          "/",
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                        ]}
                        keepCharPositions={true}
                        guide={false}
                      />
                    }
                    selected={field.value}
                    showPopperArrow={false}
                    maxDate={new Date()}
                    showMonthDropdown
                    showYearDropdown
                    dateFormatCalendar="MMMM"
                    dateFormat="dd/MM/yyyy"
                    yearDropdownItemNumber={200}
                    scrollableYearDropdown
                    popperClassName="datepicker"
                    popperPlacement="top-start"
                    popperModifiers={[
                      {
                        name: "offset",
                        options: {
                          offset: [0, -20],
                        },
                      },
                      {
                        name: "preventOverflow",
                        options: {
                          rootBoundary: "viewport",
                          tether: false,
                          altAxis: true,
                        },
                      },
                    ]}
                  />
                )}
              />

              {errors.dob && (
                <span className={style.error}>Date of birth is required</span>
              )}
            </div>

            <div className={`animate__animated ${style.inputWrap}`}>
              <label className="form-label" htmlFor="nomineeName">
                % of nomination
              </label>
              <div className="sliderWrap">
                {!editMode && nomineeCount === 0 && (
                  <ReactSlider
                    className="horizontal_slider"
                    thumbClassName="example_thumb"
                    trackClassName="example_track"
                    defaultValue={100}
                    disabled
                    ariaLabel={["Rightmost thumb"]}
                    pearling
                  />
                )}

                {!editMode && nomineeCount === 1 && (
                  <ReactSlider
                    className="horizontal_slider"
                    thumbClassName="example_thumb"
                    trackClassName="example_track"
                    defaultValue={50}
                    minDistance={1}
                    min={1}
                    max={99}
                    pearling
                    onChange={(val) => handleInput(val, nomineeCount)}
                  />
                )}

                {!editMode && nomineeCount === 2 && (
                  <ReactSlider
                    className="horizontal_slider"
                    thumbClassName="example_thumb"
                    trackClassName="example_track"
                    defaultValue={[34, 67]}
                    minDistance={1}
                    max={99}
                    min={1}
                    ariaLabel={["Leftmost thumb", "Rightmost thumb"]}
                    pearling
                    onChange={(val) => {
                      handleInput(val);
                    }}
                  />
                )}

                {editMode && nomineeCount === 1 && (
                  <ReactSlider
                    className="horizontal_slider"
                    thumbClassName="example_thumb"
                    trackClassName="example_track"
                    defaultValue={100}
                    disabled
                    minDistance={1}
                    min={1}
                    ariaLabel={["Rightmost thumb"]}
                    pearling
                  />
                )}

                {editMode && nomineeCount === 2 && (
                  <ReactSlider
                    className="horizontal_slider"
                    thumbClassName="example_thumb"
                    trackClassName="example_track"
                    defaultValue={nominee1Share}
                    pearling
                    minDistance={1}
                    max={99}
                    min={1}
                    onChange={(val) => handleInput(val, nomineeCount)}
                  />
                )}

                {editMode && nomineeCount === 3 && (
                  <ReactSlider
                    className="horizontal_slider"
                    minDistance={1}
                    min={1}
                    max={99}
                    thumbClassName="example_thumb"
                    trackClassName="example_track"
                    defaultValue={[
                      nominee1Share,
                      nominee1Share + nominee2Share,
                    ]}
                    ariaLabel={["Leftmost thumb", "Rightmost thumb"]}
                    pearling
                    onChange={(val) => {
                      handleInput(val);
                    }}
                  />
                )}

                <ul className={style.sliderNumWrap}>
                  <li className={style.sliderNum}>0</li>
                  <li className={style.sliderNum}>|</li>
                  <li className={style.sliderNum}>20</li>
                  <li className={style.sliderNum}>|</li>
                  <li className={style.sliderNum}>40</li>
                  <li className={style.sliderNum}>|</li>
                  <li className={style.sliderNum}>60</li>
                  <li className={style.sliderNum}>|</li>
                  <li className={style.sliderNum}>80</li>
                  <li className={style.sliderNum}>|</li>
                  <li className={style.sliderNum}>100</li>
                </ul>

                {IndicatorArr}

                <div className={style.sliderTip}>
                  Move the slider to the left or right to
                  <strong>distribute nomination share</strong> between the
                  nominees.
                </div>
              </div>
            </div>

            <div className={`animate__animated ${style.inputWrap}`}>
              <label className="form-label" htmlFor="nomineeName">
                Nominee's PAN/Aadhaar number
              </label>

              <div className="inputTooltip animate__animated">
                <div
                  className={`tooltip ${!showPanErrorMsgNominee && "hide"} `}
                >
                  <div className="icon-Access-denied "></div>

                  <span className="tooltipText tooltip-top">
                    {selectedDocumentNominee === "A" ? "Aadhaar " : "Pan "}
                    details invalid!
                  </span>
                </div>

                <input
                  type={selectedDocumentNominee === "A" ? "number" : "text"}
                  className="form-control"
                  placeholder="Enter PAN/Aadhaar of Nominee"
                  maxLength={selectedDocumentNominee === "A" ? 12 : 10}
                  {...register("panOrAadhaar", {
                    required: "PAN Number or Aadhaar Number is required",
                  })}
                  onChange={(e) => {
                    const msg = validatePANOrAadhaar(e.target.value);
                    setSelectedDocumentNominee(msg.type);
                    void trigger("panOrAadhaar");
                    if (msg.valid) {
                      setError(false);
                      setShowPanErrorMsgNominee(false);
                    } else {
                      setError(true);
                      setShowPanErrorMsgNominee(true);
                    }
                    const maxLength = selectedDocumentNominee === "A" ? 12 : 10;
                    setValue(
                      "panOrAadhaar",
                      e.target.value
                        .slice(0, maxLength)
                        .replace(/[^a-z0-9]/gi, "")
                        .toLocaleUpperCase(),
                      { shouldValidate: true }
                    );
                  }}
                />
              </div>
              {errors.panOrAadhaar && (
                <span className={style.error}>
                  Pan or Aadhaar field is required
                </span>
              )}
            </div>

            <div className={`animate__animated ${style.inputWrap}`}>
              <label className="form-label" htmlFor="nomineeName">
                Nominee's address
              </label>
              <textarea
                name="nomineeAddress"
                style={{ height: 49, resize: "none" }}
                id="nomineeAddress"
                placeholder="Enter address"
                className="form-control"
                maxLength={200}
                {...register("nomineeAddress", {
                  required: true,
                })}
              />
              {errors.nomineeAddress && (
                <span className={style.error}>Nominee address is required</span>
              )}
            </div>

            {/* Guardian's detail required in case of nominee is minor  */}
            {showGuardianForm ? (
              <div className={`${style.guardContainer}`}>
                <h4 className={style.guardTitle}>Guardian Details</h4>
                <div className={style.guardContainerBox}>
                  <label className="form-label" htmlFor="nomineeName">
                    Name of nominee guardian
                  </label>

                  <div className={` ${style.inputWrap}`}>
                    <input
                      {...register("guardName", { required: true })}
                      id="guardName"
                      className="form-control"
                      name="guardName"
                      placeholder="Enter guardian's name"
                      onChange={(e) => {
                        setValue(
                          "guardName",
                          e.target.value.replace(/[^a-z ]/gi, ""),
                          { shouldValidate: true }
                        );
                        CompareWithNomineeName(e.target.value);
                      }}
                    />
                    {errors.Guard_Name_Same_As_Nominee && (
                      <span className={style.error}>
                        {errors.Guard_Name_Same_As_Nominee?.message}
                      </span>
                    )}

                    {errors.guardName && (
                      <span className={style.error}>
                        Guardian name is required
                      </span>
                    )}
                  </div>

                  <div className={` ${style.inputWrap}`}>
                    <label
                      className="form-label"
                      htmlFor="relationshipWithNominee"
                    >
                      Guardian's relationship with nominee
                    </label>

                    <div className="form-select">
                      <select
                        name="guardRelationship"
                        className="form-control"
                        onFocus={() => trigger("guardRelationship")}
                        {...register("guardRelationship", { required: true })}
                      >
                        <option value="">Select Relationship</option>
                        {nomineeRelationship.map((relation, index) => (
                          <option key={index} value={relation}>
                            {relation}
                          </option>
                        ))}
                      </select>
                    </div>

                    {errors.guardRelationship && (
                      <span className={style.error}>
                        Guardian relationship is required
                      </span>
                    )}
                  </div>
                  <div className={` ${style.inputWrap}`}>
                    <div className="datepickerWrap">
                      <label className="form-label" htmlFor="dobNominee1">
                        Guardian's date of birth
                      </label>

                      <Controller
                        control={control}
                        name="guardDob"
                        rules={{ required: true }}
                        render={({ field }) => (
                          <DatePicker
                            className="form-control"
                            minDate={new Date(yyMin, mm, dd)}
                            maxDate={new Date(yyMax, mm - 1, dd)}
                            placeholderText="DD/MM/YY"
                            onChange={(date) => {
                              setValue("guardDob", new Date(date));
                              field.onChange(date);
                            }}
                            onCalendarClose={() => {
                              checkAge(getValues("guardDob"), "G");
                            }}
                            onBlur={() => {
                              checkAge(getValues("guardDob"), "G");
                              void trigger("guardDob");
                            }}
                            onDayMouseEnter={() => {
                              checkAge(getValues("guardDob"), "G");
                              void trigger("guardDob");
                            }}
                            onClickOutside={() => {
                              checkAge(getValues("guardDob"), "G");
                              void trigger("guardDob");
                            }}
                            customInput={
                              <MaskedInput
                                pipe={autoCorrectedDatePipe}
                                mask={[
                                  /\d/,
                                  /\d/,
                                  "/",
                                  /\d/,
                                  /\d/,
                                  "/",
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                ]}
                                keepCharPositions={true}
                                guide={false}
                              />
                            }
                            selected={field.value}
                            showPopperArrow={false}
                            showMonthDropdown
                            showYearDropdown
                            dateFormatCalendar="MMMM"
                            dateFormat="dd/MM/yyyy"
                            yearDropdownItemNumber={200}
                            yearItemNumber={99}
                            scrollableYearDropdown
                            popperClassName="datepicker"
                            popperPlacement="top-start"
                            popperModifiers={[
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -20],
                                },
                              },
                              {
                                name: "preventOverflow",
                                options: {
                                  rootBoundary: "viewport",
                                  tether: false,
                                  altAxis: true,
                                },
                              },
                            ]}
                          />
                        )}
                      />
                    </div>

                    {errors.guardDob && (
                      <span className={style.error}>
                        Date of birth is required
                      </span>
                    )}

                    {errors.Guardian_Age_Should_18 && (
                      <span className={style.error}>
                        {errors.Guardian_Age_Should_18?.message}
                      </span>
                    )}
                  </div>

                  <div className={` ${style.inputWrap}`}>
                    <label className="form-label" htmlFor="nomineeName">
                      Guardian's PAN/Aadhaar number
                    </label>

                    <div className="inputTooltip ">
                      <div
                        className={`tooltip ${!showPanErrorMsgGuardian && "hide"
                          } `}
                      >
                        <div className="icon-Access-denied "></div>

                        <span className="tooltipText tooltip-top">
                          {selectedDocumentGuard === "A" ? "Aadhaar " : "Pan "}
                          details invalid!
                        </span>
                      </div>

                      <input
                        type={selectedDocumentGuard === "A" ? "number" : "text"}
                        className="form-control"
                        placeholder="Enter PAN/Aadhaar of Guardian"
                        maxLength={selectedDocumentGuard === "A" ? 12 : 10}
                        {...register("guardPanOrAadhaar", {
                          required: "PAN Number or Aadhaar is required",
                        })}
                        onChange={(e) => {
                          const msg = validatePANOrAadhaar(e.target.value);
                          setSelectedDocumentGuard(msg.type);

                          const maxLength =
                            selectedDocumentGuard === "A" ? 12 : 10;

                          if (msg.valid) {
                            setError(false);
                            setShowPanErrorMsgGuardian(false);
                          } else {
                            setError(true);
                            setShowPanErrorMsgGuardian(true);
                          }
                          setValue(
                            "guardPanOrAadhaar",
                            e.target.value
                              .slice(0, maxLength)
                              .replace(/[^a-z0-9]/gi, "")
                              .toLocaleUpperCase(),
                            { shouldValidate: true }
                          );
                          void trigger("guardPanOrAadhaar");
                        }}
                      />
                    </div>

                    {errors.guardPanOrAadhaar && (
                      <span className={style.error}>
                        Guardian pan or Aadhaar is required
                      </span>
                    )}
                  </div>

                  <div className={` ${style.inputWrap}`}>
                    <label className="form-label" htmlFor="nomineeName">
                      Guardian's address
                    </label>
                    <textarea
                      name="guardAddress"
                      style={{ height: 49, resize: "none" }}
                      id="nomineeName"
                      placeholder="Enter address"
                      className="form-control"
                      {...register("guardAddress", {
                        maxLength: 200,
                        required: true,
                      })}
                    />
                    {errors.guardAddress && (
                      <span className={style.error}>
                        Guardian address is required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
            {console.log("isMinor   " + isMinor)}
            {/* disabled until complete form validation */}
            <div className="animate__animated btn-sticky zIndex">
              <ButtonUI
                type="submit"
                disabled={!isValid || isError}
              >
                Add nominee
              </ButtonUI>
            </div>
          </div>
        </section>
      </form>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.LandingReducer.error.isError,
    showError: state.LandingReducer.error.showHide,
    errorMsg: state.LandingReducer.error.ErrorMsg,
    redirectTo: state.LandingReducer.error.redirectTo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setError: (errorOb) => dispatch(SET_ERROR(errorOb)),
    hideErrorModal: (path) => dispatch(HIDE_ERROR_MODAL({ redirect: "" })),
    showErrorModal: () => dispatch(SHOW_ERROR_MODAL()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNominee);
