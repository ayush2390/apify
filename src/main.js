import { Actor } from "apify";
import { CheerioCrawler } from "crawlee";

await Actor.init();

const crawler = new CheerioCrawler({
  async requestHandler({ request, $, enqueueLinks }) {
    const { url } = request;

    // Extract HTML title of the page.
    const title = $("title").text();
    console.log(`Title of ${url}: ${title}`);

    const headings = [];
    $("h1, h2, h3, h4, h5, h6").each((i, element) => {
      const headingObject = {
        level: $(element).prop("tagName").toLowerCase(),
        text: $(element).text(),
      };
      console.log("Extracted heading", headingObject);
      headings.push(headingObject);
    });

    // Add URLs that match the provided pattern.
    await enqueueLinks({
      globs: ["https://www.google.com/"],
    });

    // Save extracted data to dataset.
    await Actor.pushData(headings);
  },
});

// Enqueue the initial request and run the crawler
await crawler.run(["https://www.google.com/"]);

await Actor.exit();
