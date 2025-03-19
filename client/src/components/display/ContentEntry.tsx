import { Content, Book, Movie, PodcastEpisode, TvShow } from "../../types/content";
import { ReactNode } from "react";
import { ContentIcon, ContentLabel } from "./ContentLabel";

type ContentEntryProps = {
    entry: Content;
    isMobile?: boolean;
    children?: ReactNode;
};

export function ContentEntry({ entry, isMobile }: ContentEntryProps) {

    const Display = () => {
        return isMobile
            ? entry.uri
                ? <a
                    href={entry.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full p-3 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                    <MobileDisplay entry={entry} />
                </a>
                : <div className="block w-full p-3 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                    <MobileDisplay entry={entry} />
                </div>
            : entry.uri
                ? <a
                    href={entry.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                >
                    <DesktopDisplay entry={entry} />
                </a>
                : <DesktopDisplay entry={entry} />
    }

    return <Display />
}

const Thumbnail = ({ entry }: { entry: Content }) => (
    entry.thumbnailUrl && (
        <div className="shrink-0">
            <img
                src={entry.thumbnailUrl}
                alt={entry.title}
                className="w-20 h-20 object-cover rounded-md outline outline-gray-800"
            />
        </div>
    )
);

const MobileDisplay = ({ entry }: { entry: Content }) => (
    <div className="flex items-center flex-1">
        <div className="shrink-0">
            <ContentIcon entry={entry} />
        </div>

        <div className="flex-1 min-w-0 ml-3 px-2">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                {entry.title}
            </h3>

            <div className="text-xs text-gray-600 line-clamp-2">
                {(Book.isType(entry)) && (
                    <span className="font-medium">
                        {entry.author?.join(", ")}
                    </span>
                )}

                {PodcastEpisode.isType(entry) && (
                    <span className="font-medium">
                        {entry.podcastName}
                    </span>
                )}

                {(Movie.isType(entry)) && (
                    <span className="font-medium">
                        {entry.director?.join(", ")} | {entry.actors?.join(", ")}
                    </span>
                )}

                {(TvShow.isType(entry)) && (
                    <span className="font-medium">
                        {entry.writer?.join(", ")} | {entry.actors?.join(", ")}
                    </span>
                )}
            </div>
        </div>
    </div>
)

const DesktopDisplay = ({ entry }: { entry: Content }) => (
    <div className="flex items-center w-full">
        <Thumbnail entry={entry} />
        <div className="flex flex-1 items-center ml-4">
            <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 leading-tight mb-1">
                    {entry.title}
                </h3>

                <div className="text-sm text-gray-600">
                    {(Book.isType(entry)) && (
                        <span className="font-medium">
                            {entry.author?.join(", ")}
                        </span>
                    )}

                    {PodcastEpisode.isType(entry) && (
                        <span className="font-medium">
                            {entry.podcastName}
                        </span>
                    )}

                    {(Movie.isType(entry)) && (
                        <span className="font-medium">
                            {entry.director?.join(", ")} | {entry.actors?.join(", ")}
                        </span>
                    )}

                    {(TvShow.isType(entry)) && (
                        <span className="font-medium">
                            {entry.writer?.join(", ")} | {entry.actors?.join(", ")}
                        </span>
                    )}
                </div>

                {entry.description && (
                    <span className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {entry.description}
                    </span>
                )}
            </div>
            <div className="shrink-0 ml-4">
                <ContentLabel entry={entry} />
            </div>
        </div>
    </div>
)