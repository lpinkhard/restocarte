/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type MenuItemCreateFormInputValues = {
    title?: string;
    description?: string;
    enabled?: boolean;
    price?: number;
    image?: string;
    owner?: string;
};
export declare type MenuItemCreateFormValidationValues = {
    title?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    enabled?: ValidationFunction<boolean>;
    price?: ValidationFunction<number>;
    image?: ValidationFunction<string>;
    owner?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MenuItemCreateFormOverridesProps = {
    MenuItemCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    enabled?: PrimitiveOverrideProps<SwitchFieldProps>;
    price?: PrimitiveOverrideProps<TextFieldProps>;
    image?: PrimitiveOverrideProps<TextFieldProps>;
    owner?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type MenuItemCreateFormProps = React.PropsWithChildren<{
    overrides?: MenuItemCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: MenuItemCreateFormInputValues) => MenuItemCreateFormInputValues;
    onSuccess?: (fields: MenuItemCreateFormInputValues) => void;
    onError?: (fields: MenuItemCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MenuItemCreateFormInputValues) => MenuItemCreateFormInputValues;
    onValidate?: MenuItemCreateFormValidationValues;
} & React.CSSProperties>;
export default function MenuItemCreateForm(props: MenuItemCreateFormProps): React.ReactElement;
