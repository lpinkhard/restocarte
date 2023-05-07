/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Restaurant } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type RestaurantUpdateFormInputValues = {
    name?: string;
    tagline?: string;
    logo?: string;
    favicon?: string;
    userId?: string;
    currency?: string;
    owner?: string;
};
export declare type RestaurantUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    tagline?: ValidationFunction<string>;
    logo?: ValidationFunction<string>;
    favicon?: ValidationFunction<string>;
    userId?: ValidationFunction<string>;
    currency?: ValidationFunction<string>;
    owner?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RestaurantUpdateFormOverridesProps = {
    RestaurantUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    tagline?: PrimitiveOverrideProps<TextFieldProps>;
    logo?: PrimitiveOverrideProps<TextFieldProps>;
    favicon?: PrimitiveOverrideProps<TextFieldProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    currency?: PrimitiveOverrideProps<TextFieldProps>;
    owner?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type RestaurantUpdateFormProps = React.PropsWithChildren<{
    overrides?: RestaurantUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    restaurant?: Restaurant;
    onSubmit?: (fields: RestaurantUpdateFormInputValues) => RestaurantUpdateFormInputValues;
    onSuccess?: (fields: RestaurantUpdateFormInputValues) => void;
    onError?: (fields: RestaurantUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RestaurantUpdateFormInputValues) => RestaurantUpdateFormInputValues;
    onValidate?: RestaurantUpdateFormValidationValues;
} & React.CSSProperties>;
export default function RestaurantUpdateForm(props: RestaurantUpdateFormProps): React.ReactElement;
