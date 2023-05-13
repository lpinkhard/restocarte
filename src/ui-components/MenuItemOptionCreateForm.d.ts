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
export declare type MenuItemOptionCreateFormInputValues = {
    title?: string;
    priceDelta?: number;
    exclusive?: boolean;
    order?: number;
    owner?: string;
};
export declare type MenuItemOptionCreateFormValidationValues = {
    title?: ValidationFunction<string>;
    priceDelta?: ValidationFunction<number>;
    exclusive?: ValidationFunction<boolean>;
    order?: ValidationFunction<number>;
    owner?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MenuItemOptionCreateFormOverridesProps = {
    MenuItemOptionCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    priceDelta?: PrimitiveOverrideProps<TextFieldProps>;
    exclusive?: PrimitiveOverrideProps<SwitchFieldProps>;
    order?: PrimitiveOverrideProps<TextFieldProps>;
    owner?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type MenuItemOptionCreateFormProps = React.PropsWithChildren<{
    overrides?: MenuItemOptionCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: MenuItemOptionCreateFormInputValues) => MenuItemOptionCreateFormInputValues;
    onSuccess?: (fields: MenuItemOptionCreateFormInputValues) => void;
    onError?: (fields: MenuItemOptionCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MenuItemOptionCreateFormInputValues) => MenuItemOptionCreateFormInputValues;
    onValidate?: MenuItemOptionCreateFormValidationValues;
} & React.CSSProperties>;
export default function MenuItemOptionCreateForm(props: MenuItemOptionCreateFormProps): React.ReactElement;
