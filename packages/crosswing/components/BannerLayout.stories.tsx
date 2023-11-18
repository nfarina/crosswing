import { useAsyncTask } from "../hooks/useAsyncTask";
import { wait } from "../shared/wait";
import { CrosswingAppDecorator } from "../storybook";
import { BannerLayout } from "./BannerLayout";
import { NoContent } from "./NoContent";

export default {
  component: BannerLayout,
  decorators: [CrosswingAppDecorator({ layout: "mobile" })],
  parameters: { layout: "centered" },
};

export const Visible = () => (
  <BannerLayout title="Reticulating Splines" visible />
);

export const WithHandler = () => {
  const task = useAsyncTask({
    func: () => wait(3000),
    onError: null,
  });

  return (
    <BannerLayout visible={task.isRunning}>
      <NoContent action="Show Banner" onActionClick={task.run} />
    </BannerLayout>
  );
};
