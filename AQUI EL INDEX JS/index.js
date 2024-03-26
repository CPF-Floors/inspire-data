import axios from "axios";
import * as xlsx from "xlsx";
const baseUrl = `https://us13.api.mailchimp.com/3.0/reports`;
const campaign = "4a3e2a9cde";
const headers = {
  Authorization: "Bearer 8588b613a087ca3d8fc43607e3d0681a-us13",
};
function saveToExcel(data, fileName) {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(wb, ws, "Sheet 1");
  xlsx.writeFile(wb, fileName);
}
// Función para obtener y mapear los datos de sentTo
async function sentTo() {
  try {
    const response = await axios.get(`${baseUrl}/${campaign}/sent-to?count=1000`, {
      headers,
    });
    const dataMap = response.data.sent_to.map((e) => {
      return {
        emailAddress: e.email_address,
        openCount: e.open_count,
        lastOpen: e.last_open,
        status: e.status,
        FNAME: e.merge_fields.FNAME,
        MMERGE4: e.merge_fields.MMERGE4,
        MMERGE2: e.merge_fields.MMERGE2,
        SMSPHONE: e.merge_fields.SMSPHONE
        
      };
    });
    console.log("Data Mapped (sentTo):", dataMap);
    saveToExcel(dataMap, "sentTo.xlsx");
  } catch (error) {
    console.error("Error fetching sent to details:", error.message);
  }
}
// Función para obtener y mapear los detalles de clics
async function clickDetails() {
  try {
    const response = await axios.get(`${baseUrl}/${campaign}/click-details?count=1000`, {
      headers,
    });
    const dataMap = response.data.urls_clicked.map((e) => {
      return {
        totalClicks: e.total_clicks,
        url: e.url,
        campaignId: e.campaign_id,
      };
    });
    console.log("Data Mapped (clickDetails):", dataMap);
    saveToExcel(dataMap, "clickDetails.xlsx");
  } catch (error) {
    console.error("Error fetching click details:", error.message);
  }
}
sentTo();
clickDetails();