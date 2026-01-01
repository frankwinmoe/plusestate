import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

interface LoaderProps {
  loadingText?: string;
}

const Loader = ({ loadingText }: LoaderProps) => {
  if (loadingText) {
    return (
      <div className="flex max-w-xs flex-col gap-4 [--radius:1rem]">
        <Item variant="muted">
          <ItemMedia>
            <Spinner />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="line-clamp-1">{loadingText}</ItemTitle>
          </ItemContent>
        </Item>
      </div>
    );
  }
  return <Spinner />;
};

export default Loader;
