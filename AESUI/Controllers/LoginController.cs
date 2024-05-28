using System;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using AESUI.Models;

namespace AESUI.Controllers
{
    public class LoginController : Controller
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LoginController(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor)
        {
            _httpClientFactory = httpClientFactory;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(string umobno, string upwd)
        {
            try
            {
                var apiUrl = $"https://localhost:7092/api/LoginAPI/ValidateCredentials?UMobno={umobno}&UPwd={upwd}";

                using var httpClient = new HttpClient();
                var response = await httpClient.PostAsync(apiUrl, null);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var validateResponse = JsonConvert.DeserializeObject<ValidateCredentialsResponse>(content);

                    if (validateResponse.IsSuccess)
                    {
                        // If credentials are valid, call another API to get user name
                        var userName = await GetUserNameByUserPhnnoAsync(umobno);

                        // Store user name in session or perform any other action
                        HttpContext.Session.SetString("UserName", userName);

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

        private async Task<string> GetUserNameByUserPhnnoAsync(string phoneno)
        {
            try
            {
                var apiUrl = $"https://localhost:7092/api/LoginAPI/GetUserNameByUserPhnno?UMobno={phoneno}";

                using var httpClient = new HttpClient();
                var response = await httpClient.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    var userName = await response.Content.ReadAsStringAsync();
                    return userName;
                }
                else
                {
                    return "John Doe";
                }
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return "John Doe";
            }
        }
        public IActionResult Logout()
        {
            // Clear session values
            HttpContext.Session.Remove("UserName");
            HttpContext.Session.Clear();

            // Add headers to prevent caching
            Response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
            Response.Headers.Add("Pragma", "no-cache"); // HTTP 1.0.
            Response.Headers.Add("Expires", "0"); // Proxies.

            return RedirectToAction("Index", "Login"); // Redirect to home page after logout
        }

    }
}
