using AESUI.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace AESUI.Controllers
{
    public class StudentLoginController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(string stdmobno, string stdpwd)
        {
            try
            {
                var apiUrl = $"https://localhost:7092/api/StudentLoginAPI/ValidateCredentialsOfStudent?StdMobNo={stdmobno}&StdPwd={stdpwd}";

                using var httpClient = new HttpClient();
                var response = await httpClient.PostAsync(apiUrl, null);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var validateResponse = JsonConvert.DeserializeObject<ValidateCredentialsResponse>(content);

                    if (validateResponse.IsSuccess)
                    {
                        // If credentials are valid, call another API to get user name
                        var studentdata = await GetStudentDataUsingStudentPhoneno(stdmobno);

                        // Store user name in session or perform any other action
                        HttpContext.Session.SetString("StudentName", studentdata.StdFrstname + " " + studentdata.StdLstname);
                        HttpContext.Session.SetString("StudentId", studentdata.StdId.ToString());

                        return Json(new { Success = true });
                    }
                    else
                    {
                        return Json(new { Success = false, Message = validateResponse.Message });
                    }
                }
                else
                {
                    return Json(new { Success = false, Message = "An error occurred while processing your request." });
                }
            }
            catch (HttpRequestException)
            {
                // Return login view in case of HttpClient request exception
                return Json(new { Success = false, Message = "An error occurred while processing your request." });
            }
        }

        private async Task<StudentData> GetStudentDataUsingStudentPhoneno(string stdMobNo)
        {
            try
            {
                var apiUrl = $"https://localhost:7092/api/StudentLoginAPI/GetStudentData/{stdMobNo}";

                using var httpClient = new HttpClient();
                var response = await httpClient.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var studentData = JsonConvert.DeserializeObject<StudentData>(content);
                    return studentData;
                }
                else
                {
                    // Handle API error response
                    return null;
                }
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return null;
            }
        }

        public async Task<List<StudentInfo>> GetStudentExamDataByStudentid(string stdid)
        {
            try
            {
                long stdId = long.Parse(stdid);
                var apiUrl = $"https://localhost:7092/api/StudentLoginAPI/GetStudentInfo/{stdId}";
                using var httpClient = new HttpClient();
                var response = await httpClient.GetAsync(apiUrl);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var studentinfo = JsonConvert.DeserializeObject<List<StudentInfo>>(content);
                    return studentinfo;
                }
                else
                {
                    return null;
                }
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return null;
            }
        }

    }
}
