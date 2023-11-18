import { FormEvent, FormHTMLAttributes, ReactElement, ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../colors/colors";
import { fonts } from "../fonts/fonts";
import { safeArea } from "../host/features/safeArea";
import { Scrollable, StyledScrollable } from "./Scrollable";
import { StyledSeparatorLayout } from "./SeparatorLayout";
import { FormValues } from "./forms/useFormValues";

/**
 * A common "wizard" like layout for going through a step by step process.
 */
export function SetupLayout({
  top,
  title,
  message,
  children,
  actions,
  legal,
  form,
  ...rest
}: {
  top?: ReactNode;
  title?: ReactNode;
  message?: ReactNode;
  children?: ReactElement<any>;
  actions?: ReactNode;
  legal?: ReactNode;
  form?: FormValues;
} & Omit<FormHTMLAttributes<HTMLFormElement>, "title">) {
  function onFormSubmit(e: FormEvent) {
    e.preventDefault();
  }

  // We handle balancing title/message/children similar to AlertView.
  return (
    <StyledSetupLayout
      data-has-actions={!!actions}
      onSubmit={onFormSubmit}
      {...rest}
      {...form?.props}
    >
      {top && <div className="top" children={top} />}
      <Scrollable>
        <ScrollingArea data-has-children={!!children}>
          {(title || message) && (
            <div className="content">
              {title && <div className="title" children={title} />}
              {message && <div className="message" children={message} />}
            </div>
          )}
          <div className="children">{children}</div>
        </ScrollingArea>
      </Scrollable>
      {actions && <div className="actions" children={actions} />}
      {legal && <div className="legal" children={legal} />}
    </StyledSetupLayout>
  );
}

export const StyledSetupLayout = styled.form`
  display: flex;
  flex-flow: column;
  padding-bottom: ${safeArea.bottom()};
  position: relative;

  > .top {
    flex-shrink: 0;
  }

  > ${StyledScrollable} {
    height: 0;
    flex-grow: 1;
    flex-shrink: 0;
    z-index: 0;
  }

  &[data-has-actions="false"] > ${StyledScrollable} {
    /* Balance out the (presumed) top nav bar if there are no actions at the bottom to do so. */
    margin-bottom: 50px;
  }

  > .actions {
    flex-shrink: 0;
    padding: 10px;
    display: flex;
    flex-flow: row;
    z-index: 1;

    > * {
      flex-grow: 1;
    }
  }

  > .legal {
    text-align: center;
    padding: 7px 10px 20px 10px;
    font: ${fonts.display({ size: 13, line: "19px" })};
    color: ${colors.text()};

    a {
      color: ${colors.primary()};
      text-decoration: none;
    }
  }
`;

const ScrollingArea = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  padding: 40px 0;

  > .content {
    display: flex;
    flex-flow: column;
    padding: 0 10px;

    > .title {
      font: ${fonts.displayBold({ size: 34, line: "40px" })};
      color: ${colors.text()};
    }

    > .message {
      font: ${fonts.display({ size: 16, line: "28px" })};
      color: ${colors.text()};

      > ${StyledSeparatorLayout} {
        margin-left: -10px;
        margin-right: -10px;
      }
    }

    > .title + .message {
      margin-top: 10px;
    }
  }

  > .children {
    display: flex;

    > * {
      flex-grow: 1;
    }
  }
`;
