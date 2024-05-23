import type { SVGProps } from "react";
const CheckmarkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.73598 19.468L2 12.7337L3.20566 11.528L8.73598 13.646L20.7943 5L22 6.20567L8.73598 19.468Z"
      fill="currentColor"
    />
  </svg>
);
export { CheckmarkIcon };
