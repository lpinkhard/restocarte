/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Category } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type CategoryUpdateFormInputValues = {
    title?: string;
    description?: string;
    enabled?: boolean;
    price?: number;
    image?: string;
    order?: number;
    owner?: string;
};
export declare type CategoryUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    enabled?: ValidationFunction<boolean>;
    price?: ValidationFunction<number>;
    image?: ValidationFunction<string>;
    order?: ValidationFunction<number>;
    owner?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CategoryUpdateFormOverridesProps = {
    CategoryUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    enabled?: PrimitiveOverrideProps<SwitchFieldProps>;
    price?: PrimitiveOverrideProps<TextFieldProps>;
    image?: PrimitiveOverrideProps<TextFieldProps>;
    order?: PrimitiveOverrideProps<TextFieldProps>;
    owner?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CategoryUpdateFormProps = React.PropsWithChildren<{
    overrides?: CategoryUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    category?: Category;
    onSubmit?: (fields: CategoryUpdateFormInputValues) => CategoryUpdateFormInputValues;
    onSuccess?: (fields: CategoryUpdateFormInputValues) => void;
    onError?: (fields: CategoryUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CategoryUpdateFormInputValues) => CategoryUpdateFormInputValues;
    onValidate?: CategoryUpdateFormValidationValues;
} & React.CSSProperties>;
export default function CategoryUpdateForm(props: CategoryUpdateFormProps): React.ReactElement;
