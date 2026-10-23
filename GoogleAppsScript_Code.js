/**
 * GOOGLE APPS SCRIPT CODE FOR COGNIBLOOM SURVEY
 * 
 * Instructions to set up:
 * 1. Open your Google Sheet where you want responses.
 * 2. Click "Extensions" -> "Apps Script".
 * 3. Delete existing code in Code.gs, paste this entire file, and click Save.
 * 4. Click "Deploy" -> "New deployment".
 * 5. Select type: "Web app".
 * 6. Set Description: "CogniBloom Survey Webhook".
 * 7. Execute as: "Me".
 * 8. Who has access: "Anyone" (IMPORTANT!).
 * 9. Click "Deploy", authorize permissions, and copy the Web App URL.
 * 10. Paste the Web App URL in your .env file as:
 *     VITE_GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Auto-create header row if the sheet is completely blank
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp",
        "Name",
        "Email",
        "Phone",
        "Learning Stage",
        "School Class",
        "College Year",
        "College Stream",
        "Memory Loss Timeframe",
        "Biggest Academic Enemy",
        "Annoying Info Type",
        "Relearning Time Spent",
        "Concept Stickiness",
        "Study Method",
        "Click Moment",
        "Brain Type",
        "Bring Back Memory",
        "Forgetting Awareness",
        "Delete Annoying Thing",
        "Study Buddy Role",
        "Study Cheat Code",
        "Memory Tool Utility",
        "Retention Factor",
        "Study Buddy Preference",
        "Academic Red Flag",
        "Academic Superpower"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3e8ff");
    }
    
    // Append the new response row
    var row = [
      data.submittedAt || new Date().toISOString(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.learning_stage || "",
      data.school_class || "",
      data.college_year || "",
      data.college_stream || "",
      data.memory_loss_timeframe || "",
      data.academic_enemy || "",
      data.annoying_info_type || "",
      data.relearning_time_spent || "",
      data.concept_stickiness || "",
      data.study_method || "",
      data.click_moment || "",
      data.brain_type || "",
      data.bring_back_memory || "",
      data.forgetting_awareness || "",
      data.delete_annoying_thing || "",
      data.study_buddy_role || "",
      data.study_cheat_code || "",
      data.memory_tool_utility || "",
      data.retention_factor || "",
      data.study_buddy_preference || "",
      data.academic_red_flag || "",
      data.academic_superpower || ""
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
