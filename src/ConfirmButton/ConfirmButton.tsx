import { Omit } from "@material-ui/core";
import Button, { ButtonProps } from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Theme } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import createStyles from "@material-ui/styles/createStyles";
import withStyles, { WithStyles } from "@material-ui/styles/withStyles";
import classNames from "classnames";
import React from "react";

export type ConfirmButtonTransitionState =
  | "loading"
  | "success"
  | "error"
  | "default";

const styles = (theme: Theme) =>
  createStyles({
    error: {
      "&:hover": {
        backgroundColor: theme.palette.error.main
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText
    },
    icon: {
      marginLeft: "0 !important",
      position: "absolute",
      transitionDuration: theme.transitions.duration.standard + "ms"
    },
    invisible: {
      opacity: 0
    },
    label: {
      alignItems: "center",
      display: "flex",
      transitionDuration: theme.transitions.duration.standard + "ms"
    },
    progress: {
      "& svg": {
        color: theme.palette.common.white,
        margin: 0
      },
      position: "absolute",
      transitionDuration: theme.transitions.duration.standard + "ms"
    },
    success: {
      "&:hover": {
        backgroundColor: theme.palette.primary.main
      },
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    }
  });

export type ConfirmButtonLabelKeys = "errorLabel" | "successLabel";
export type ConfirmButtonLabels = Record<
  ConfirmButtonLabelKeys,
  React.ReactNode
>;
export interface ConfirmButtonProps
  extends Omit<ButtonProps, "classes">,
    Partial<ConfirmButtonLabels> {
  transitionState: ConfirmButtonTransitionState;
}

interface ConfirmButtonState {
  displayCompletedActionState: boolean;
}

const ConfirmButton = withStyles(styles)(
  class ConfirmButtonComponent extends React.Component<
    ConfirmButtonProps &
      WithStyles<
        "error" | "icon" | "invisible" | "label" | "progress" | "success"
      >,
    ConfirmButtonState
  > {
    static getDerivedStateFromProps(
      nextProps: ConfirmButtonProps,
      prevState: ConfirmButtonState
    ): ConfirmButtonState {
      if (nextProps.transitionState === "loading") {
        return {
          displayCompletedActionState: true
        };
      }
      return prevState;
    }

    state: ConfirmButtonState = {
      displayCompletedActionState: false
    };
    timeout = null;

    componentDidUpdate(prevProps: ConfirmButtonProps) {
      const { transitionState } = this.props;
      if (prevProps.transitionState !== transitionState) {
        if (
          (["error", "success"] as ConfirmButtonTransitionState[]).includes(
            transitionState
          )
        ) {
          this.timeout = setTimeout(
            () =>
              this.setState({
                displayCompletedActionState: false
              }),
            2000
          );
        } else if (transitionState === "loading") {
          clearTimeout(this.timeout);
        }
      }
    }

    componentWillUnmount() {
      clearTimeout(this.timeout);
    }

    render() {
      const {
        children,
        classes,
        className,
        disabled,
        errorLabel,
        successLabel,
        transitionState,
        onClick,
        ...props
      } = this.props;
      const { displayCompletedActionState } = this.state;

      return (
        <Button
          variant="contained"
          onClick={transitionState === "loading" ? undefined : onClick}
          color="primary"
          className={classNames({
            [classes.error]:
              transitionState === "error" && displayCompletedActionState,
            [classes.success]:
              transitionState === "success" && displayCompletedActionState,
            [className]: true
          })}
          disabled={!displayCompletedActionState && disabled}
          {...props}
        >
          <CircularProgress
            size={24}
            color="inherit"
            className={classNames({
              [classes.progress]: true,
              [classes.invisible]: transitionState !== "loading"
            })}
          />
          {successLabel ? (
            <span
              className={classNames({
                [classes.invisible]: !(
                  transitionState === "success" && displayCompletedActionState
                )
              })}
            >
              {successLabel}
            </span>
          ) : (
            <CheckIcon
              className={classNames({
                [classes.icon]: true,
                [classes.invisible]: !(
                  transitionState === "success" && displayCompletedActionState
                )
              })}
            />
          )}
          <span
            className={classNames({
              [classes.label]: true,
              [classes.invisible]:
                (transitionState === "loading" ||
                  transitionState === "success") &&
                displayCompletedActionState
            })}
          >
            {transitionState === "error" && displayCompletedActionState
              ? errorLabel || <CloseIcon className={classes.icon} />
              : children}
          </span>
        </Button>
      );
    }
  }
);
ConfirmButton.displayName = "ConfirmButton";
export default ConfirmButton;
