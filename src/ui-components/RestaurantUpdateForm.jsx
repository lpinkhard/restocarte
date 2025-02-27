/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Restaurant } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function RestaurantUpdateForm(props) {
  const {
    id: idProp,
    restaurant: restaurantModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    tagline: "",
    logo: "",
    favicon: "",
    userId: "",
    currency: "",
    socialLogin: "",
    styleData: "",
    onlineOrders: false,
    owner: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [tagline, setTagline] = React.useState(initialValues.tagline);
  const [logo, setLogo] = React.useState(initialValues.logo);
  const [favicon, setFavicon] = React.useState(initialValues.favicon);
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [currency, setCurrency] = React.useState(initialValues.currency);
  const [socialLogin, setSocialLogin] = React.useState(
    initialValues.socialLogin
  );
  const [styleData, setStyleData] = React.useState(initialValues.styleData);
  const [onlineOrders, setOnlineOrders] = React.useState(
    initialValues.onlineOrders
  );
  const [owner, setOwner] = React.useState(initialValues.owner);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = restaurantRecord
      ? { ...initialValues, ...restaurantRecord }
      : initialValues;
    setName(cleanValues.name);
    setTagline(cleanValues.tagline);
    setLogo(cleanValues.logo);
    setFavicon(cleanValues.favicon);
    setUserId(cleanValues.userId);
    setCurrency(cleanValues.currency);
    setSocialLogin(cleanValues.socialLogin);
    setStyleData(cleanValues.styleData);
    setOnlineOrders(cleanValues.onlineOrders);
    setOwner(cleanValues.owner);
    setErrors({});
  };
  const [restaurantRecord, setRestaurantRecord] =
    React.useState(restaurantModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(Restaurant, idProp)
        : restaurantModelProp;
      setRestaurantRecord(record);
    };
    queryData();
  }, [idProp, restaurantModelProp]);
  React.useEffect(resetStateValues, [restaurantRecord]);
  const validations = {
    name: [],
    tagline: [],
    logo: [],
    favicon: [],
    userId: [{ type: "Required" }],
    currency: [],
    socialLogin: [],
    styleData: [],
    onlineOrders: [],
    owner: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          name,
          tagline,
          logo,
          favicon,
          userId,
          currency,
          socialLogin,
          styleData,
          onlineOrders,
          owner,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          await DataStore.save(
            Restaurant.copyOf(restaurantRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "RestaurantUpdateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={false}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              tagline,
              logo,
              favicon,
              userId,
              currency,
              socialLogin,
              styleData,
              onlineOrders,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Tagline"
        isRequired={false}
        isReadOnly={false}
        value={tagline}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              tagline: value,
              logo,
              favicon,
              userId,
              currency,
              socialLogin,
              styleData,
              onlineOrders,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.tagline ?? value;
          }
          if (errors.tagline?.hasError) {
            runValidationTasks("tagline", value);
          }
          setTagline(value);
        }}
        onBlur={() => runValidationTasks("tagline", tagline)}
        errorMessage={errors.tagline?.errorMessage}
        hasError={errors.tagline?.hasError}
        {...getOverrideProps(overrides, "tagline")}
      ></TextField>
      <TextField
        label="Logo"
        isRequired={false}
        isReadOnly={false}
        value={logo}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              tagline,
              logo: value,
              favicon,
              userId,
              currency,
              socialLogin,
              styleData,
              onlineOrders,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.logo ?? value;
          }
          if (errors.logo?.hasError) {
            runValidationTasks("logo", value);
          }
          setLogo(value);
        }}
        onBlur={() => runValidationTasks("logo", logo)}
        errorMessage={errors.logo?.errorMessage}
        hasError={errors.logo?.hasError}
        {...getOverrideProps(overrides, "logo")}
      ></TextField>
      <TextField
        label="Favicon"
        isRequired={false}
        isReadOnly={false}
        value={favicon}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              tagline,
              logo,
              favicon: value,
              userId,
              currency,
              socialLogin,
              styleData,
              onlineOrders,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.favicon ?? value;
          }
          if (errors.favicon?.hasError) {
            runValidationTasks("favicon", value);
          }
          setFavicon(value);
        }}
        onBlur={() => runValidationTasks("favicon", favicon)}
        errorMessage={errors.favicon?.errorMessage}
        hasError={errors.favicon?.hasError}
        {...getOverrideProps(overrides, "favicon")}
      ></TextField>
      <TextField
        label="User id"
        isRequired={true}
        isReadOnly={false}
        value={userId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              tagline,
              logo,
              favicon,
              userId: value,
              currency,
              socialLogin,
              styleData,
              onlineOrders,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.userId ?? value;
          }
          if (errors.userId?.hasError) {
            runValidationTasks("userId", value);
          }
          setUserId(value);
        }}
        onBlur={() => runValidationTasks("userId", userId)}
        errorMessage={errors.userId?.errorMessage}
        hasError={errors.userId?.hasError}
        {...getOverrideProps(overrides, "userId")}
      ></TextField>
      <TextField
        label="Currency"
        isRequired={false}
        isReadOnly={false}
        value={currency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              tagline,
              logo,
              favicon,
              userId,
              currency: value,
              socialLogin,
              styleData,
              onlineOrders,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.currency ?? value;
          }
          if (errors.currency?.hasError) {
            runValidationTasks("currency", value);
          }
          setCurrency(value);
        }}
        onBlur={() => runValidationTasks("currency", currency)}
        errorMessage={errors.currency?.errorMessage}
        hasError={errors.currency?.hasError}
        {...getOverrideProps(overrides, "currency")}
      ></TextField>
      <TextField
        label="Social login"
        isRequired={false}
        isReadOnly={false}
        value={socialLogin}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              tagline,
              logo,
              favicon,
              userId,
              currency,
              socialLogin: value,
              styleData,
              onlineOrders,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.socialLogin ?? value;
          }
          if (errors.socialLogin?.hasError) {
            runValidationTasks("socialLogin", value);
          }
          setSocialLogin(value);
        }}
        onBlur={() => runValidationTasks("socialLogin", socialLogin)}
        errorMessage={errors.socialLogin?.errorMessage}
        hasError={errors.socialLogin?.hasError}
        {...getOverrideProps(overrides, "socialLogin")}
      ></TextField>
      <TextField
        label="Style data"
        isRequired={false}
        isReadOnly={false}
        value={styleData}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              tagline,
              logo,
              favicon,
              userId,
              currency,
              socialLogin,
              styleData: value,
              onlineOrders,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.styleData ?? value;
          }
          if (errors.styleData?.hasError) {
            runValidationTasks("styleData", value);
          }
          setStyleData(value);
        }}
        onBlur={() => runValidationTasks("styleData", styleData)}
        errorMessage={errors.styleData?.errorMessage}
        hasError={errors.styleData?.hasError}
        {...getOverrideProps(overrides, "styleData")}
      ></TextField>
      <SwitchField
        label="Online orders"
        defaultChecked={false}
        isDisabled={false}
        isChecked={onlineOrders}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              tagline,
              logo,
              favicon,
              userId,
              currency,
              socialLogin,
              styleData,
              onlineOrders: value,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.onlineOrders ?? value;
          }
          if (errors.onlineOrders?.hasError) {
            runValidationTasks("onlineOrders", value);
          }
          setOnlineOrders(value);
        }}
        onBlur={() => runValidationTasks("onlineOrders", onlineOrders)}
        errorMessage={errors.onlineOrders?.errorMessage}
        hasError={errors.onlineOrders?.hasError}
        {...getOverrideProps(overrides, "onlineOrders")}
      ></SwitchField>
      <TextField
        label="Owner"
        isRequired={false}
        isReadOnly={false}
        value={owner}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              tagline,
              logo,
              favicon,
              userId,
              currency,
              socialLogin,
              styleData,
              onlineOrders,
              owner: value,
            };
            const result = onChange(modelFields);
            value = result?.owner ?? value;
          }
          if (errors.owner?.hasError) {
            runValidationTasks("owner", value);
          }
          setOwner(value);
        }}
        onBlur={() => runValidationTasks("owner", owner)}
        errorMessage={errors.owner?.errorMessage}
        hasError={errors.owner?.hasError}
        {...getOverrideProps(overrides, "owner")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || restaurantModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || restaurantModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
