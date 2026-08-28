import { api } from "~/trpc/react";

export function useOptimisticToggleItem() {
  const utils = api.useUtils();

  return api.system.toggleItem.useMutation({
    onMutate: async ({ id }) => {
      await utils.system.items.cancel();
      const previousData = utils.system.items.getData();
      utils.system.items.setData(undefined, (old) =>
        old?.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)) ?? [],
      );
      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) utils.system.items.setData(undefined, context.previousData);
    },
    onSettled: () => {
      void utils.system.items.invalidate();
    },
  });
}
