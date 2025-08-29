"use client";

import * as React from "react";
import { Button as BaseButton, buttonClasses } from "@mui/base";
import { styled } from "@mui/system";

interface ButtonUIProps {
    children: React.ReactNode;
    color: "primary" | "secondary" | "tertiary";
}

const palette = {
    primary: {
        400: "#3a3a3a",
        500: "#242424",
        600: "#1a1a1a",
        700: "#0f0f0f",
    },
    secondary: {
        200: "#ffea70",
        300: "#ffdf40",
        400: "#ffd633",
        500: "#f8d108",
        600: "#e6c000",
        700: "#b39700",
    },
    tertiary: {
        200: "#99CCFF",
        300: "#66B2FF",
        400: "#3399FF",
        500: "#007FFF", // main
        600: "#0072E5",
        700: "#0066CC",
    },
    grey: {
        200: "#DAE2ED",
        700: "#434D5B",
    },
};

const baseStyles = `
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 10px 22px;
  border-radius: 8px;
  transition: all 150ms ease;
  cursor: pointer;
`;

const PrimaryButton = styled(BaseButton)(
    ({ theme }) => `
  ${baseStyles}
  background-color: ${palette.primary[500]};
  color: #ffffff;
  border: 1px solid ${palette.primary[500]};
  box-shadow: 0 2px 1px ${
        theme.palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.5)"
            : "rgba(45, 45, 60, 0.2)"
    }, inset 0 1.5px 1px ${palette.primary[400]}, inset 0 -2px 1px ${
        palette.primary[600]
    };

  &:hover {
    background-color: ${palette.primary[600]};
  }

  &.${buttonClasses.active} {
    background-color: ${palette.primary[700]};
    box-shadow: none;
    transform: scale(0.99);
  }

  &.${buttonClasses.disabled} {
    background-color: ${palette.grey[200]};
    color: ${palette.grey[700]};
    border: 0;
    cursor: default;
    box-shadow: none;
  }
`
);

const SecondaryButton = styled(BaseButton)(
    ({ theme }) => `
  ${baseStyles}
  background-color: ${palette.secondary[500]};
  color: #000000;
  border: 1px solid ${palette.secondary[500]};
  box-shadow: 0 2px 1px ${
        theme.palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.5)"
            : "rgba(45, 45, 60, 0.2)"
    }, inset 0 1.5px 1px ${palette.secondary[300]}, inset 0 -2px 1px ${
        palette.secondary[600]
    };

  &:hover {
    background-color: ${palette.secondary[400]};
  }

  &.${buttonClasses.active} {
    background-color: ${palette.secondary[700]};
    box-shadow: none;
    transform: scale(0.99);
  }

  &.${buttonClasses.disabled} {
    background-color: ${palette.grey[200]};
    color: ${palette.grey[700]};
    border: 0;
    cursor: default;
    box-shadow: none;
  }
`
);

const TertiaryButton = styled(BaseButton)(
    ({ theme }) => `
  ${baseStyles}
  background-color: ${palette.tertiary[500]};
  color: #ffffff;
  border: 1px solid ${palette.tertiary[500]};
  box-shadow: 0 2px 1px ${
        theme.palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.5)"
            : "rgba(45, 45, 60, 0.2)"
    }, inset 0 1.5px 1px ${palette.tertiary[300]}, inset 0 -2px 1px ${
        palette.tertiary[600]
    };

  &:hover {
    background-color: ${palette.tertiary[600]};
  }

  &.${buttonClasses.active} {
    background-color: ${palette.tertiary[700]};
    box-shadow: none;
    transform: scale(0.99);
  }

  &.${buttonClasses.disabled} {
    background-color: ${palette.grey[200]};
    color: ${palette.grey[700]};
    border: 0;
    cursor: default;
    box-shadow: none;
  }
`
);

const ButtonUI: React.FC<ButtonUIProps> = ({ children, color }) => {
    if (color === "primary") {
        return <PrimaryButton>{children}</PrimaryButton>;
    }
    if (color === "secondary") {
        return <SecondaryButton>{children}</SecondaryButton>;
    }
    return <TertiaryButton>{children}</TertiaryButton>;
};

export default ButtonUI;
