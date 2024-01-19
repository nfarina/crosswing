import { colors } from "crosswing/colors";
import { StyledTextInput } from "crosswing/components/forms/TextInput";
import { fonts } from "crosswing/fonts";
import { styled } from "styled-components";

export const TransformerDecorator = (Story: () => any) => (
  <Container children={<Story />} />
);

const Container = styled.div`
  display: flex;
  flex-flow: column;

  > ${StyledTextInput} {
    /* Make it stand out in Storybook against the background. */
    border: 1px solid ${colors.separator()};
    border-radius: 6px;

    > input {
      padding: 10px;
    }
  }

  > pre {
    color: ${colors.textSecondary()};
    font: ${fonts.displayMono({ size: 14 })};
  }

  > * + * {
    margin-top: 20px;
  }
`;
