import type { SVGProps } from "react";
const BackIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M23 11H9.99997V7.145C9.99997 6.044 9.25697 5.652 8.34897 6.272L1.40097 11.017C0.492971 11.637 0.492971 12.652 1.40097 13.272L8.34897 18.017C9.25697 18.637 9.99997 18.244 9.99997 17.145V13H23C23.55 13 24 12.55 24 12C24 11.45 23.55 11 23 11Z"
      fill="currentColor"
    />
  </svg>
);
export { BackIcon };
