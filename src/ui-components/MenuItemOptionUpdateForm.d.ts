/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { MenuItemOption } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type MenuItemOptionUpdateFormInputValues = {
    title?: string;
    priceDelta?: number;
    exclusive?: boolean;
    order?: number;
    owner?: string;
};
export declare type MenuItemOptionUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    priceDelta?: ValidationFunction<number>;
    exclusive?: ValidationFunction<boolean>;
    order?: ValidationFunction<number>;
    owner?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MenuItemOptionUpdateFormOverridesProps = {
    MenuItemOptionUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    priceDelta?: PrimitiveOverrideProps<TextFieldProps>;
    exclusive?: PrimitiveOverrideProps<SwitchFieldProps>;
    order?: PrimitiveOverrideProps<TextFieldProps>;
    owner?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type MenuItemOptionUpdateFormProps = React.PropsWithChildren<{
    overrides?: MenuItemOptionUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    menuItemOption?: MenuItemOption;
    onSubmit?: (fields: MenuItemOptionUpdateFormInputValues) => MenuItemOptionUpdateFormInputValues;
    onSuccess?: (fields: MenuItemOptionUpdateFormInputValues) => void;
    onError?: (fields: MenuItemOptionUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MenuItemOptionUpdateFormInputValues) => MenuItemOptionUpdateFormInputValues;
    onValidate?: MenuItemOptionUpdateFormValidationValues;
} & React.CSSProperties>;
export default function MenuItemOptionUpdateForm(props: MenuItemOptionUpdateFormProps): React.ReactElement;
