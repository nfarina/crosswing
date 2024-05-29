import { styled } from "styled-components";
import { colors } from "../colors/colors";
import { fonts } from "../fonts/fonts";

export type ErrorLike = Error | string | ErrorObj;

export type ErrorObj = {
  name?: string;
  message?: string;
  stack?: string;
  /**
   * Marks this error as fit to display to the user. Default is `true` if not
   * defined. May be used by other components, for instance, if set to false,
   * useErrorAlert() will show a generic message by default until the user
   * clicks a Details button.
   */
  userFacing?: boolean;
};

/**
 * Renders an Error in a scrollable <pre> with syntax formatting.
 */
export function ErrorView({ error }: { error: ErrorLike }) {
  const { name, message, stack } = getErrorProps(error);

  const stackLines: string[] = stack?.split("\n") ?? [];
  stackLines.shift(); // First line is just name/message.

  function renderLine(line: string) {
    // line is something like "at filterColumns (http://localhost:8904/static/bundle.cb63e.js:63612:48)"
    const match = line.match(/^(\s+)at (.*) \((.*):(\d+):(\d+)\)$/);

    if (match) {
      const [, indent, func, file, line, col] = match;
      return (
        <>
          <span>{indent}</span>
          <span className="details">at </span>
          <span className="function">{func}</span>
          <span className="details"> ({file}</span>
          <span className="details">
            :{line}:{col})
          </span>
        </>
      );
    }

    return <span>{line}</span>;
  }

  return (
    <StyledErrorView>
      <pre>
        <span key="error-name" className="name">
          {name || "Error"}
        </span>
        :{" "}
        <span key="error-message" className="message">
          {message}
        </span>
        <br />
        {stackLines.map((line, index) => (
          <div key={index} className="line">
            {renderLine(line)}
          </div>
        ))}
      </pre>
    </StyledErrorView>
  );
}

export function getErrorProps(error: ErrorLike): ErrorObj {
  return typeof error === "string" ? { message: error } : error;
}

export const StyledErrorView = styled.div`
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
  background: ${colors.black({ alpha: 0.02 })};

  /* https://stackoverflow.com/a/25045641/66673 */
  width: 0;
  min-width: 100%;

  /* Mimic the color scheme of the "Light+" theme in VSCode. */
  > pre {
    font: ${fonts.displayMonoMedium({ size: 14 })};
    color: ${colors.text({ alpha: 0.8 })};
    margin: 0;

    > .name {
      color: #ff0000;
    }

    > .message {
      color: #008000;
    }

    > .line {
      > .function {
        color: #795e26;
      }

      > .details {
        color: ${colors.textSecondary()};
      }
    }
  }

  @media (prefers-color-scheme: dark) {
    background: ${colors.black({ alpha: 0.3 })};

    /* Mimic the color scheme of the "One Dark Pro" theme in VSCode. */
    > pre {
      > .name {
        color: #e06c75;
      }

      > .message {
        color: #98c379;
      }

      > .line {
        > .function {
          color: #d19a66;
        }
      }
    }
  }
`;
