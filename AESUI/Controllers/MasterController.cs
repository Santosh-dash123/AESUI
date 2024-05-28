using AESUI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace AESUI.Controllers
{
    public class MasterController : Controller
    {
        private readonly ILogger<MasterController> _logger;

        public MasterController(ILogger<MasterController> logger)
        {
            _logger = logger;
        }

        #region Dashboard
        public IActionResult DashBoard()
        {
            return View();
        }
        #endregion

        #region User
        public IActionResult User()
        {
            return View();
        }
        #endregion

        #region QuestionOptions
        public IActionResult QuestionOptions()
        {
            return View();
        }
        #endregion

        #region Exam
        public IActionResult Exam()
        {
            return View();
        }
        #endregion

        #region Student
        public IActionResult Student()
        {
            return View();
        }
        #endregion

        #region ExamSetup
        public IActionResult ExamSetup()
        {
            return View();
        }
        #endregion

        #region ExamGiven
        public IActionResult ExamGiven()
        {
            return View();
        }
        #endregion
        #region ExamDescr
        public IActionResult ExamDescr()
        {
            return View();
        }
        #endregion
        #region ExamPage
        public IActionResult ExamPage()
        {
            return View();
        }
        #endregion
    }
}